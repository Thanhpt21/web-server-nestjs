import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { EnquiriesService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Public } from '@/decorator/customize';

@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}

  @Post()
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiriesService.create(createEnquiryDto);
  }

  @Get()
  @Public()
  async findAll(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string
  ) {
    return this.enquiriesService.findAll(query, +current, +pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enquiriesService.findOne(id);
  }

  @Put()
  update(@Body() updateEnquiryDto: UpdateEnquiryDto) {
    return this.enquiriesService.update(updateEnquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enquiriesService.remove(id);
  }
}
