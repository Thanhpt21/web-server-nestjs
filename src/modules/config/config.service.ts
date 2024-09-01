import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Config } from './schemas/config.schema'; // Đổi tên schema từ Category thành Config
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ConfigService {
  constructor(
    @InjectModel(Config.name) private configModel: Model<Config> // Đổi tên model từ categoryModel thành configModel
  ) {}

  async create(createConfigDto: CreateConfigDto) {
    const {
      name,
      phone,
      email,
      address,
      facebook,
      zalo,
      instagram,
      tiktok,
      youtube,
      messenger,
      logo,
      favicon
    } = createConfigDto;

    try {
      const config = new this.configModel({
        name,
        phone,
        email,
        address,
        facebook,
        zalo,
        instagram,
        tiktok,
        youtube,
        messenger,
        logo,
        favicon
      });

      await config.save();

      return { _id: config._id.toString() };
    } catch (error) {
      throw new Error('Error creating config: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.configModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.configModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data
    };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.configModel.findById(id);
  }

  async update(updateConfigDto: UpdateConfigDto) {
    const {
      _id,
      name,
      phone,
      email,
      address,
      facebook,
      zalo,
      instagram,
      tiktok,
      youtube,
      messenger,
      logo,
      favicon
    } = updateConfigDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateConfigDto> = {};
      if (name) updatePayload.name = name;
      if (phone) updatePayload.phone = phone;
      if (email) updatePayload.email = email;
      if (address) updatePayload.address = address;
      if (facebook) updatePayload.facebook = facebook;
      if (zalo) updatePayload.zalo = zalo;
      if (instagram) updatePayload.instagram = instagram;
      if (tiktok) updatePayload.tiktok = tiktok;
      if (youtube) updatePayload.youtube = youtube;
      if (messenger) updatePayload.messenger = messenger;
      if (logo) updatePayload.logo = logo;
      if (favicon) updatePayload.favicon = favicon;

      const result = await this.configModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy cấu hình');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật cấu hình: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.configModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
