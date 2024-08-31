import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './schemas/color.schema'; // Đổi tên schema từ Category thành Color
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ColorsService {
  constructor(
    @InjectModel(Color.name) private colorModel: Model<Color> // Đổi tên model từ categoryModel thành colorModel
  ) {}

  async create(createColorDto: CreateColorDto) {
    const { title, code } = createColorDto; // Sử dụng các trường phù hợp với Color

    try {
      const color = new this.colorModel({
        title,
        code, // Thay thế image bằng code cho màu
      });

      await color.save();

      return { _id: color._id.toString() };
    } catch (error) {
      throw new Error('Error creating color: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.colorModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.colorModel
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
    return this.colorModel.findById(id);
  }

  async update(updateColorDto: UpdateColorDto) {
    const { _id, title, code } = updateColorDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateColorDto> = {};
      if (title) updatePayload.title = title;
      if (code) updatePayload.code = code; // Cập nhật trường mã màu

      const result = await this.colorModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy màu');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật màu: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.colorModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
