import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BrandsService } from './brand.service'; // Đảm bảo rằng bạn đã tạo dịch vụ tương ứng
import { CreateBrandDto } from './dto/create-brand.dto'; // DTO để tạo thương hiệu
import { UpdateBrandDto } from './dto/update-brand.dto'; // DTO để cập nhật thương hiệu
import { Public } from '@/decorator/customize'; // Tùy chọn công khai cho các route nếu cần

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query('category') category: string
  ) {
    return this.brandsService.findAll(query, +current, +pageSize, category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Put()
  update(@Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }

  @Get('/category/:categoryId')
  async getBrandsByCategory(@Param('categoryId') categoryId: string) {
    return this.brandsService.findBrandsByCategoryId(categoryId);
  }
}
