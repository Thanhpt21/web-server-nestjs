import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { Public } from '@/decorator/customize'; // Giả định có decorator Public để public route

@Controller('ships')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post()
  create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query('province') province: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    return this.shipService.findAll(province, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipService.findOne(id);
  }

  @Put()
  update(@Body() updateShipDto: UpdateShipDto) {
    return this.shipService.update(updateShipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipService.remove(id);
  }
}
