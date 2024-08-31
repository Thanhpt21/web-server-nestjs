import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BlogsService } from './blog.service'; // Giả sử dịch vụ BlogsService đã được tạo
import { CreateBlogDto } from './dto/create-blog.dto'; // DTO tạo blog
import { UpdateBlogDto } from './dto/update-blog.dto'; // DTO cập nhật blog
import { Public } from '@/decorator/customize'; // Giả sử có decorator Public để cho phép truy cập công khai

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @Post()
    async create(@Body() createBlogDto: CreateBlogDto) {
        return this.blogsService.create(createBlogDto);
    }

    @Get()
    @Public()
    async findAll(
        @Query() query: string,
        @Query('current') current: string,
        @Query('pageSize') pageSize: string
    ) {
        return this.blogsService.findAll(query, +current, +pageSize);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.blogsService.findOne(id);
    }

    @Put()
    async update(@Body() updateBlogDto: UpdateBlogDto) {
        return this.blogsService.update(updateBlogDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.blogsService.remove(id);
    }
}
