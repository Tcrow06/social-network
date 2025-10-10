import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UserFilterDto {
    @IsOptional()
    @IsString()
    q?: string; // search query (email/username/displayName)

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc';
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    displayName?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
