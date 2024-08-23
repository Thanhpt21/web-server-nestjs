import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from '@/helpers/utils';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  isEmailExit = async (email: string) => {
    const isExits = await this.userModel.exists({email})
    if(isExits) return true;
    return false;
  } 

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    

    const isExitsEmail = await this.isEmailExit(email);
    if(isExitsEmail){
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng chọn email khác`)
    }

    try {
      const hashedPassword = await hashPassword(password);

      const user = new this.userModel({
        name,
        email,
        password: hashedPassword
      });

      await user.save();
      
      return { _id: user._id.toString() };
    } catch (error) {
      throw new Error('Error creating user');
    }
  
  }

  async findAll(query: string, current: number, pageSize: number) {
    const {filter, sort} = aqp(query);

    if(filter.current) delete filter.current
    if(filter.pageSize) delete filter.pageSize

    if(!current) current = 1;
    if(!pageSize) pageSize = 10;

    const totalItems = ((await this.userModel.find(filter)).length)
    const totalPages = Math.ceil(totalItems / pageSize)
    const skip = (+current - 1)*(+pageSize)

    const data = await this.userModel
    .find(filter)
    .limit(pageSize)
    .skip(skip)
    .select("-password")
    .sort(sort as any)
    return {data, totalPages};
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail (email: string) {
    return await this.userModel.findOne({email})
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({_id: updateUserDto._id}, {...updateUserDto});
  }

  async remove(_id: string) {
    if(mongoose.isValidObjectId(_id)){
      return this.userModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Invalid Id")
    }
   
  }

  async register(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
  
    const isExitsEmail = await this.isEmailExit(email);
    if(isExitsEmail){
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng chọn email khác`)
    }

    try {
      const hashedPassword = await hashPassword(password);

      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        isActive: false,
        codeId: uuidv4(),
        codeExpired: dayjs().add(1, 'minutes'),
      });

      
      return { _id: user._id};
    } catch (error) {
      throw new Error('Error creating user');
    }
  }
}
