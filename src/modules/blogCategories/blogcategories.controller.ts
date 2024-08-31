import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { BlogCategoriesService } from './blogcategories.service';
import { CreateBlogCategoryDto } from './dto/create-blogcategory.dto';
import { UpdateCategoryDto } from './dto/update-blogcategory.dto';
import { Public } from '@/decorator/customize';

@Controller('blog-categories')
export class BlogCategoriesController {
    constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

    @Post()
    async create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
        return this.blogCategoriesService.create(createBlogCategoryDto);
    }



    @Get()
    @Public()
    async findAll(@Query() query: string,
    @Query("current") current: string,
    @Query("pageSize") pageSize: string
    ) {
        return this.blogCategoriesService.findAll(query, +current, +pageSize);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.blogCategoriesService.findOne(id);
    }

    @Put()
    async update(@Body() updateCategoryDto: UpdateCategoryDto) {
        return this.blogCategoriesService.update(updateCategoryDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.blogCategoriesService.remove(id);
    }
}
