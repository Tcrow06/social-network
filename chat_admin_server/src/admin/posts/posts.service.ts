import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { PostFilterDto, UpdatePostDto } from './dto/post.dto';
import { UsersService } from '../users/users.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        private usersService: UsersService,
        private mailService: MailService,
    ) { }

    async list(filter: PostFilterDto, page = 1, limit = 20) {
        const query: any = {};
        if (filter.q) {
            const regex = new RegExp(filter.q, 'i');
            query.$or = [{ content: regex }];
        }
        if (typeof filter.hidden !== 'undefined') query.hidden = filter.hidden;
        if (typeof filter.isDeleted !== 'undefined') query.isDeleted = filter.isDeleted;

        const sort: any = {};
        if (filter.sortBy) sort[filter.sortBy] = filter.order === 'asc' ? 1 : -1;
        else sort.createdAt = -1;

        // Use aggregation to also lookup author info from users collection
        const pipeline: any[] = [
            { $match: query },
            { $sort: sort },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    content: 1,
                    media: 1,
                    hidden: 1,
                    isDeleted: 1,
                    createdAt: 1,
                    author: {
                        _id: '$author._id',
                        email: '$author.email',
                        displayName: '$author.displayName',
                        avatar: '$author.avatar'
                    }
                }
            }
        ];

        const [items, total] = await Promise.all([
            this.postModel.aggregate(pipeline),
            this.postModel.countDocuments(query),
        ]);

        return { items, total, page, limit };
    }

    async getById(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Bài viết không tồn tại');
        const objId = new Types.ObjectId(id);
        const pipeline = [
            { $match: { _id: objId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    content: 1,
                    media: 1,
                    hidden: 1,
                    isDeleted: 1,
                    createdAt: 1,
                    author: {
                        _id: '$author._id',
                        email: '$author.email',
                        displayName: '$author.displayName',
                        avatar: '$author.avatarUrl'
                    }
                }
            }
        ];

        const [p] = await this.postModel.aggregate(pipeline);
        if (!p) throw new NotFoundException('Bài viết không tồn tại');
        return p;
    }

    async update(id: string, dto: UpdatePostDto) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Bài viết không tồn tại');
        const p = await this.postModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).lean();
        if (!p) throw new NotFoundException('Bài viết không tồn tại');
        return p;
    }

    async hide(id: string) {
        return this.update(id, { hidden: true });
    }

    async unhide(id: string) {
        return this.update(id, { hidden: false });
    }

    async remove(id: string) {
        if (!Types.ObjectId.isValid(id)) 
            throw new NotFoundException('Bài viết không tồn tại');
        const updated = await this.postModel.findByIdAndUpdate(id, { $set: { isDeleted: true, hidden: true } }, { new: true }).lean();
        if (!updated) throw new NotFoundException('Bài viết không tồn tại');

        // attempt to notify the post owner via email
        try {
            const authorId = updated.userId
            const user = await this.usersService.getById(String(authorId))
            if (user && (user as any).email) {
                const email = (user as any).email
                const snippet = (updated.content || '').slice(0, 300)
                await this.mailService.sendPostDeletedMail(email, snippet, 'Vi phạm điều khoản')
            }
        } catch (e) {
            // log and continue
            console.error('Failed to send post-deleted email', e)
        }

        // return the updated post along with author info
        try {
            const objId = new Types.ObjectId(id);
            const pipeline = [
                { $match: { _id: objId } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        content: 1,
                        media: 1,
                        hidden: 1,
                        isDeleted: 1,
                        createdAt: 1,
                        author: {
                            _id: '$author._id',
                            email: '$author.email',
                            displayName: '$author.displayName',
                            avatar: '$author.avatarUrl'
                        }
                    }
                }
            ];
            const [resWithAuthor] = await this.postModel.aggregate(pipeline);
            return resWithAuthor || updated;
        } catch (e) {
            return updated;
        }
    }
}
