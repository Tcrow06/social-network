import { Controller, Get, Query, Param, Patch, Body, Delete, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilterDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private users: UsersService) { }

    @Get()
    list(@Query() query: UserFilterDto & { page?: number; limit?: number }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        return this.users.list(query, page, limit);
    }

    @Get(':id')
    get(@Param('id') id: string) {
        return this.users.getById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.users.update(id, dto);
    }

    @Post(':id/disable')
    disable(@Param('id') id: string) {
        return this.users.disable(id);
    }

    @Post(':id/enable')
    enable(@Param('id') id: string) {
        return this.users.enable(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.users.remove(id);
    }
}
