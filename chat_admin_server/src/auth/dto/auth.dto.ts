import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    name: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class RefreshDto {
    @IsNotEmpty()
    refreshToken: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp: string;

    @IsNotEmpty()
    @MinLength(6)
    newPassword: string;
}

export class VerifyOtpDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    otp: string;
}
