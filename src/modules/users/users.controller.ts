import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards, Req, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { CartItemDto, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '@/decorator/customize';
import { JwtAuthGuard } from '@/auth/passport/jwt-auth.guard';
import { GetUser } from '@/decorator/get-user.decorator';


@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  )
  {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Public()
  async findAll(@Query() query: string,
  @Query("current") current: string,
  @Query("pageSize") pageSize: string
  ) {
    return this.usersService.findAll(query, +current, +pageSize);
  }



  @Get('current')
  @UseGuards(JwtAuthGuard)
  async findOne(@GetUser() user) {
    const userId = user._id;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return this.usersService.findOne(userId);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':userId/cart')
  async addToCart(
      @Param('userId') userId: string,
      @Body() cartItemDto: CartItemDto
  ) {
      return this.usersService.addToCart(userId, cartItemDto);
  }



}
