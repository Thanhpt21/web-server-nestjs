import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { Ship } from './schemas/ship.schema'; // Đổi tên schema từ Color thành Ship
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ShipService {
  constructor(
    @InjectModel(Ship.name) private shipModel: Model<Ship> // Đổi tên model từ colorModel thành shipModel
  ) {}

  async create(createShipDto: CreateShipDto) {
    const { province, price } = createShipDto;

    try {
      const ship = new this.shipModel({
        province,
        price,
      });

      await ship.save();

      return { _id: ship._id.toString() };
    } catch (error) {
      throw new Error('Error creating ship: ' + error.message);
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.shipModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.shipModel
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
    return this.shipModel.findById(id);
  }

  async update(updateShipDto: UpdateShipDto) {
    const { _id, province, price } = updateShipDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateShipDto> = {};
      if (province) updatePayload.province = province;
      if (price) updatePayload.price = price;

      const result = await this.shipModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy thông tin vận chuyển');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật thông tin vận chuyển: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.shipModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
