import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { MailService } from '../mail/mail.service';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (cfg: ConfigService) => ({
                secret: cfg.get<string>('JWT_ACCESS_TOKEN_PRIVATE_KEY') || process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
                signOptions: { expiresIn: cfg.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1d' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, MailService, JwtAuthGuard],
    exports: [AuthService, MailService, JwtAuthGuard, JwtModule],
})
export class AuthModule { }
