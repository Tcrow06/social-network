import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../schemas/admin.schema';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]), AuthModule, UsersModule],
    controllers: [AdminsController],
    providers: [AdminsService],
    exports: [AdminsService]
})
export class AdminsModule { }
