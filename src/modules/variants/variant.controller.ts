import { Body, Controller, Delete, Param, Post, Put, BadRequestException, Query, Get } from '@nestjs/common';
import { VariantsService } from './variant.service'; // Đảm bảo đường dẫn đúng
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';

@Controller('variants')
export class VariantsController {
  constructor(private readonly variantsService: VariantsService) {}

  @Post()
  async create(@Body() createVariantDto: CreateVariantDto) {
    try {
      return await this.variantsService.create(createVariantDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put()
  async update(@Body() updateVariantDto: UpdateVariantDto) {
    try {
      return await this.variantsService.update(updateVariantDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.variantsService.remove(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':product')
  async findAll(
    @Param('product') product: string,
    @Query('query') query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    try {
      return await this.variantsService.findAll(product, query, +current, +pageSize);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':product/:id')
  async findOne(
    @Param('product') product: string,
    @Param('id') id: string
  ) {
    try {
      return await this.variantsService.findOne(product, id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':productId')
  async findByProductId(
    @Param('productId') productId: string,
  ) {
    return this.variantsService.findByProductId(productId);
  }
}
