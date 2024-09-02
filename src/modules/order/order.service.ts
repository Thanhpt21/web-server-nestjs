import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order> 
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      products,
      status,
      address,
      total,
      coupon,
      ship,
      methodPayment,
      deliveryMethod,
      orderBy
    } = createOrderDto;

    try {
      const order = new this.orderModel({
        products,
        status: status || 1, // Default status if not provided
        address,
        total,
        coupon,
        ship,
        methodPayment,
        deliveryMethod,
        orderBy,
      });

      await order.save();

      return { _id: order._id.toString() };
    } catch (error) {
      throw new Error('Error creating order: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    if (filter.status) {
      filter.status = { $in: filter.status };
    }

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.orderModel
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
    return this.orderModel.findById(id);
  }

  async update(updateOrderDto: UpdateOrderDto) {
    const {_id} = updateOrderDto;
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateOrderDto> = {};


      if (updateOrderDto.status) updatePayload.status = updateOrderDto.status;
      


      const result = await this.orderModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy đơn hàng');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật đơn hàng: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.orderModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
