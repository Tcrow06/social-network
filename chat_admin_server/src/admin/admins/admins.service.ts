import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin, AdminDocument } from '../../schemas/admin.schema';
import { CreateAdminDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
    constructor(@InjectModel(Admin.name) private adminModel: Model<AdminDocument>) { }

    async list(filter: any, page = 1, limit = 20) {
        const query: any = {};
        if (filter.q) {
            const regex = new RegExp(filter.q, 'i');
            query.$or = [{ email: regex }, { name: regex }];
        }
        if (typeof filter.isRoot !== 'undefined') query.isRoot = filter.isRoot;

        const sort: any = { createdAt: -1 };
        const projection = '-password -refreshTokenHash -otpHash -otpExpiresAt -__v';
        const [items, total] = await Promise.all([
            this.adminModel.find(query).select(projection).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
            this.adminModel.countDocuments(query),
        ]);

        return { items, total, page, limit };
    }

    async create(dto: CreateAdminDto, currentAdminId: string) {
        // Only root admins can create other admins
        const current = await this.adminModel.findById(currentAdminId).lean();
        if (!current || !current.isRoot) throw new ForbiddenException('Chỉ root mới có quyền tạo admin');

        const exists = await this.adminModel.findOne({ email: dto.email });
        if (exists) throw new ConflictException('Email đã tồn tại');

        const hash = await bcrypt.hash(dto.password, 10);
        const created = await this.adminModel.create({ email: dto.email, password: hash, name: dto.name, isRoot: !!dto.isRoot });
        return {
            _id: created._id,
            email: created.email,
            name: created.name,
            isRoot: false,
        };
    }

    async remove(id: string, currentAdminId: string) {
        if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Admin không tồn tại');
        if (id === currentAdminId) throw new ForbiddenException('Không thể xóa chính mình');
        // Only root can delete admins
        const current = await this.adminModel.findById(currentAdminId).lean();
        if (!current || !current.isRoot) throw new ForbiddenException('Chỉ root mới có quyền xóa admin');

        const res = await this.adminModel.findByIdAndDelete(id).lean();
        if (!res) throw new NotFoundException('Admin không tồn tại');
        return { message: 'Xóa thành công' };
    }
}
