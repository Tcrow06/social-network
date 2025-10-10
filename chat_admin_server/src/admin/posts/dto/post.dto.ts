import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class PostFilterDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsBoolean()
    hidden?: boolean;

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

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsBoolean()
    hidden?: boolean;
}
