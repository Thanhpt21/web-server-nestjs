import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { SizesService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Public } from '@/decorator/customize';

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Post()
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizesService.create(createSizeDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    return this.sizesService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sizesService.findOne(id);
  }

  @Put()
  update(@Body() updateSizeDto: UpdateSizeDto) {
    return this.sizesService.update(updateSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sizesService.remove(id);
  }
}
