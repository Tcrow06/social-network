import { Controller, Get, Query, Param, Patch, Body, Delete, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostFilterDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
    constructor(private posts: PostsService) { }

    @Get()
    list(@Query() query: PostFilterDto & { page?: number; limit?: number }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        return this.posts.list(query, page, limit);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.posts.getById(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.posts.remove(id);
    }
}
