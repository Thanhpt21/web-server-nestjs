import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from '@/helpers/utils';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { ChangePasswordAuthDto, CodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService
  ) {}

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
    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findByEmail (email: string) {
    return await this.userModel.findOne({email})
  }

  async update(updateUserDto: UpdateUserDto) {
    const { _id, name, phone, address } = updateUserDto;

    // Xác thực ID người dùng
    if (!mongoose.isValidObjectId(_id)) {
        throw new BadRequestException('ID người dùng không hợp lệ');
    }

    // Tạo đối tượng payload để cập nhật
    const updatePayload: Partial<UpdateUserDto> = {};
    if (name) updatePayload.name = name;
    if (phone) updatePayload.phone = phone;
    if (address) updatePayload.address = address;

    try {
        // Thực hiện cập nhật
        const result = await this.userModel.updateOne(
            { _id },
            { $set: updatePayload }
        );

        // Kiểm tra kết quả cập nhật
        if (result.matchedCount === 0) {
            throw new BadRequestException('Không tìm thấy người dùng');
        }
        if (result.modifiedCount === 0) {
            throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
        }

        return { success: true };
    } catch (error) {
        throw new Error('Lỗi khi cập nhật người dùng: ' + error.message);
    }
  }


  async remove(_id: string) {
    if(mongoose.isValidObjectId(_id)){
      return this.userModel.deleteOne({_id})
    }else{
      throw new BadRequestException("Invalid Id")
    }

  }

  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
  
    const isExitsEmail = await this.isEmailExit(email);
    if (isExitsEmail) {
      throw new BadRequestException(`Email đã tồn tại: ${email}. Vui lòng chọn email khác`);
    }

    const hashedPassword = await hashPassword(password);
      const codeId = uuidv4();
      const user = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        isActive: false,
        codeId: codeId,
        codeExpired: dayjs().add(5, 'minute'),
      });
  
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Kích hoạt tài khoản ✔',
        template: 'register.hbs',
        context: {
          name: user.name ?? user.email,
          activationCode: codeId,
        },
      });

  
      return { _id: user._id }; 
  
    // try {
      
    // } catch (error) {
    //   throw new Error('Error creating user');
    // }
  }

  async handleActiveCode(data: CodeAuthDto){
    const user= await this.userModel.findOne({
      _id: data._id,
      codeId: data.code
    })

    if(!user){
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if(isBeforeCheck){
      await this.userModel.updateOne({_id: data._id}, {isActive: true})
      return {isBeforeCheck}
    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }

  async retryActive (email:string) {
    const codeId = uuidv4();
    const user = await this.userModel.findOne({email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    if(user.isActive === true){
      throw new BadRequestException("Tài khoản đã được kích hoạt")
    }

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minute'),
    });
    
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Kích hoạt tài khoản ✔',
      template: 'register.hbs',
      context: {
        name: user.name ?? user.email,
        activationCode: codeId,
      },
    });
    return {_id: user._id}
  }

  async retryPassword (email:string) {
    const codeId = uuidv4();
    const user = await this.userModel.findOne({email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }

    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minute'),
    });
    
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Thay đổi mật khẩu ✔',
      template: 'register.hbs',
      context: {
        name: user.name ?? user.email,
        activationCode: codeId,
      },
    });
    return {_id: user._id, email: user.email}
  }

  async changePassword (data:ChangePasswordAuthDto) {
    if(data.password !== data.confirmPassword) {
      throw new BadRequestException("Mật khẩu không khớp")
    }
    const user = await this.userModel.findOne({email: data.email})
    if(!user){
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if(isBeforeCheck){
      const newPassword = await hashPassword(data.password)
      await user.updateOne({password: newPassword})
      return {isBeforeCheck}
    }else{
      throw new BadRequestException("Mã code không hợp lệ hoặc đã hết hạn")
    }
  }
}
