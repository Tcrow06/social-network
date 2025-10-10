import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UserFilterDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async list(filter: UserFilterDto, page = 1, limit = 20) {
        const query: any = {};
        if (filter.q) {
            const regex = new RegExp(filter.q, 'i');
            query.$or = [{ email: regex }, { username: regex }, { displayName: regex }];
        }
        if (typeof filter.isActive !== 'undefined') query.isActive = filter.isActive;
        if (typeof filter.isDeleted !== 'undefined') query.isDeleted = filter.isDeleted;

        const sort: any = {};
        if (filter.sortBy) sort[filter.sortBy] = filter.order === 'asc' ? 1 : -1;
        else sort.createdAt = -1;

        // exclude sensitive fields
        const projection = '-password -refreshTokenHash -otpHash -otpExpiresAt -__v';
        const [items, total] = await Promise.all([
            this.userModel.find(query).select(projection).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
            this.userModel.countDocuments(query),
        ]);

        return { items, total, page, limit };
    }

    async getById(id: string) {
        if (!Types.ObjectId.isValid(id)) 
            throw new NotFoundException('Người dùng không tồn tại');
        const u = await this.userModel.findById(id).select('-password -refreshTokenHash -otpHash -otpExpiresAt -__v').lean();
        if (!u) 
            throw new NotFoundException('Người dùng không tồn tại');
        return u;
    }

    async update(id: string, dto: UpdateUserDto) {
        if (!Types.ObjectId.isValid(id)) 
            throw new NotFoundException('Người dùng không tồn tại');
        const u = await this.userModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).select('-password -refreshTokenHash -otpHash -otpExpiresAt -__v').lean();
        if (!u) 
            throw new NotFoundException('Người dùng không tồn tại');
        return u;
    }

    async disable(id: string) {
        return await this.update(id, { isActive: false });
    }

    async enable(id: string) {
        return await this.update(id, { isActive: true });
    }

    async remove(id: string) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Người dùng không tồn tại');
    const res = await this.userModel.findByIdAndUpdate(id, { $set: { isDeleted: true, isActive: false } }, { new: true }).select('-password -refreshTokenHash -otpHash -otpExpiresAt -__v').lean();
        if (!res) throw new NotFoundException('Người dùng không tồn tại');
        return res;
    }
}
