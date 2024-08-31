import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './schemas/size.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class SizesService {
  constructor(
    @InjectModel(Size.name) private sizeModel: Model<Size>
  ) {}

  async create(createSizeDto: CreateSizeDto) {
    const { title } = createSizeDto;

    try {
      const size = new this.sizeModel({
        title,
      });

      await size.save();

      return { _id: size._id.toString() };
    } catch (error) {
      throw new Error('Error creating size: ' + error.message);
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.sizeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.sizeModel
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
    return this.sizeModel.findById(id);
  }

  async update(updateSizeDto: UpdateSizeDto) {
    const { _id, title } = updateSizeDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateSizeDto> = {};
      if (title) updatePayload.title = title;

      const result = await this.sizeModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy kích thước');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật kích thước: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.sizeModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
