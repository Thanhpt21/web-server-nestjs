import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './schemas/coupon.schema'; // Đảm bảo tên schema chính xác
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<Coupon> // Đảm bảo tên model chính xác
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    const { name, expiry, discount, minPrice, useLimit, useCount } = createCouponDto;

    try {
      const coupon = new this.couponModel({
        name,
        expiry,
        discount,
        minPrice,
        useLimit: useLimit ?? 0, // Cung cấp giá trị mặc định
        useCount: useCount ?? 0, // Cung cấp giá trị mặc định
      });

      await coupon.save();

      return { _id: coupon._id.toString() };
    } catch (error) {
      throw new Error('Error creating coupon: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.couponModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.couponModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data,
    };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.couponModel.findById(id);
  }

  async update(updateCouponDto: UpdateCouponDto) {
    const { _id } = updateCouponDto;
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateCouponDto> = {};
      if (updateCouponDto.name) updatePayload.name = updateCouponDto.name;
      if (updateCouponDto.expiry) updatePayload.expiry = updateCouponDto.expiry;
      if (updateCouponDto.discount) updatePayload.discount = updateCouponDto.discount;
      if (updateCouponDto.minPrice) updatePayload.minPrice = updateCouponDto.minPrice;
      if (updateCouponDto.useLimit !== undefined) updatePayload.useLimit = updateCouponDto.useLimit;
      if (updateCouponDto.useCount !== undefined) updatePayload.useCount = updateCouponDto.useCount;

      const result = await this.couponModel.updateOne(
        { _id},
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy coupon');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật coupon: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.couponModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
