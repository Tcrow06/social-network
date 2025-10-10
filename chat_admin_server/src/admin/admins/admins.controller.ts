import { Controller, Get, Query, Post, Body, UseGuards, Delete, Param, Req } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto, AdminFilterDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('admin/admins')
@UseGuards(JwtAuthGuard)
export class AdminsController {
    constructor(private admins: AdminsService) { }

    @Get()
    list(@Query() query: AdminFilterDto & { page?: number; limit?: number }) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        return this.admins.list(query, page, limit);
    }

    @Post()
    create(@Body() dto: CreateAdminDto, @Req() req: any) {
        const currentAdminId = req.user?.sub;
        return this.admins.create(dto, currentAdminId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: any) {
        const currentAdminId = req.user?.sub;
        return this.admins.remove(id, currentAdminId);
    }
}
