import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './schemas/store.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private storeModel: Model<Store>
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    const { name, phone, email, address, link, iframe, image } = createStoreDto;

    try {
      const store = new this.storeModel({
        name,
        phone,
        email,
        address,
        link,
        iframe,
        image
      });

      await store.save();

      return { _id: store._id.toString() };
    } catch (error) {
      throw new Error('Error creating store: ' + error.message);
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.storeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.storeModel
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
    return this.storeModel.findById(id);
  }

  async update(updateStoreDto: UpdateStoreDto) {
    const { _id, name, phone, email, address, link, iframe, image } = updateStoreDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateStoreDto> = {};
      if (name) updatePayload.name = name;
      if (phone) updatePayload.phone = phone;
      if (email) updatePayload.email = email;
      if (address) updatePayload.address = address;
      if (link) updatePayload.link = link;
      if (iframe) updatePayload.iframe = iframe;
      if (image) updatePayload.image = image;

      const result = await this.storeModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy cửa hàng');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật cửa hàng: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.storeModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
