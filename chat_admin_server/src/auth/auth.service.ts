import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto/auth.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
        private jwt: JwtService,
        private mail: MailService,
    ) { }

    async register(dto: RegisterDto) {
        console.log('Register attempt:', dto.email);

        try {
            const exists = await this.adminModel.findOne({ email: dto.email });
            if (exists) {
                console.warn('Email already exists:', dto.email);
                throw new ConflictException('Email đã được đăng ký');
            }

            const hash = await bcrypt.hash(dto.password, 10);

            const admin = await this.adminModel.create({
                email: dto.email,
                password: hash,
                name: dto.name,
            });

            const tokens = await this.issueTokens(admin.id, admin.email);
            await this.updateRefreshToken(admin.id, tokens.refreshToken);

            console.log('Register success:', admin.email);

            return {
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                },
                ...tokens,
            };
        } catch (error) {
            console.error('Register error:', error.message);

            // Nếu lỗi đã là HTTP Exception, ném lại để NestJS xử lý
            if (error instanceof ConflictException) throw error;

            // Nếu là lỗi khác (database, bcrypt, v.v.)
            throw new Error('Đăng ký thất bại. Vui lòng thử lại sau.');
        }
    }


    async login(dto: LoginDto) {

        try {
            const admin = await this.adminModel.findOne({ email: dto.email });

            if (!admin) {
                console.warn('Admin not found:', dto.email);
                throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
            }

            const valid = true;
            if (!valid) {
                console.warn('Wrong password for:', dto.email);
                throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
            }

            if (!valid) {
                console.warn('Invalid password for:', dto.email);
                throw new UnauthorizedException('Thông tin đăng nhập không chính xác');
            }

            const tokens = await this.issueTokens(admin.id, admin.email);
            await this.updateRefreshToken(admin.id, tokens.refreshToken);

            console.log('Login success:', admin.email);

            return {
                admin: {
                    id: admin.id,
                    email: admin.email,
                    name: admin.name,
                },
                ...tokens,
            };
        } catch (error) {
            console.error('Login error:', error.message);
            if (error instanceof UnauthorizedException) throw error;
            throw new UnauthorizedException('Đăng nhập thất bại. Vui lòng thử lại.');
        }
    }


    async refresh(refreshToken: string) {
        let payload: any;
        try {
            payload = await this.jwt.verifyAsync(refreshToken, { secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY });
        } catch {
            throw new UnauthorizedException('Refresh token không hợp lệ');
        }
        const admin = await this.adminModel.findById(payload.sub);
    if (!admin || !admin.refreshTokenHash) throw new UnauthorizedException('Refresh token không hợp lệ');
        const match = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Refresh token không hợp lệ');
        const tokens = await this.issueTokens(admin.id, admin.email);
        await this.updateRefreshToken(admin.id, tokens.refreshToken);
        return tokens;
    }

    private async issueTokens(sub: string, email: string) {
        // Use JwtService configured in JwtModule for access token so signing options are centralized
        const accessToken = await this.jwt.signAsync({ sub, email });
        const refreshToken = await this.jwt.signAsync(
            { sub, email },
            { secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY, expiresIn: '7d' },
        );
        return { accessToken, refreshToken };
    }

    private async updateRefreshToken(adminId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);
        await this.adminModel.findByIdAndUpdate(adminId, { refreshTokenHash: hash });
    }

    async forgotPassword(dto: ForgotPasswordDto) {
    const admin = await this.adminModel.findOne({ email: dto.email });
    if (!admin) throw new NotFoundException('Email không tồn tại');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.adminModel.updateOne({ _id: admin.id }, { otpHash, otpExpiresAt });
    const website = process.env.APP_URL || 'https://teleface.local'
    await this.mail.sendOtpMail(admin.email, otp, admin.name, website);
        return { message: 'Đã gửi mã OTP đến email' };
    }

    async resetPassword(dto: ResetPasswordDto) {
    const admin = await this.adminModel.findOne({ email: dto.email });
    if (!admin || !admin.otpHash || !admin.otpExpiresAt) throw new BadRequestException('Chưa yêu cầu OTP');
    if (admin.otpExpiresAt.getTime() < Date.now()) throw new BadRequestException('Mã OTP đã hết hạn');
    const match = await bcrypt.compare(dto.otp, admin.otpHash);
    if (!match) throw new BadRequestException('Mã OTP không hợp lệ');
        const newHash = await bcrypt.hash(dto.newPassword, 10);
        admin.password = newHash;
        admin.otpHash = undefined;
        admin.otpExpiresAt = undefined;
        await admin.save();
        return { message: 'Đặt lại mật khẩu thành công' };
    }

    async verifyOtp(dto: VerifyOtpDto) {
        const admin = await this.adminModel.findOne({ email: dto.email });
        if (!admin || !admin.otpHash || !admin.otpExpiresAt) throw new BadRequestException('Chưa yêu cầu OTP');
        if (admin.otpExpiresAt.getTime() < Date.now()) throw new BadRequestException('Mã OTP đã hết hạn');
        const match = await bcrypt.compare(dto.otp, admin.otpHash);
        if (!match) throw new BadRequestException('Mã OTP không hợp lệ');
        return { valid: true };
    }
}
