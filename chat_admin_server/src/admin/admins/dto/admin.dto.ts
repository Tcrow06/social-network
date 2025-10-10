import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAdminDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    name?: string;

    @IsOptional()
    isRoot?: boolean;
}

export class AdminFilterDto {
    @IsOptional()
    q?: string;

    @IsOptional()
    isRoot?: boolean;
}
