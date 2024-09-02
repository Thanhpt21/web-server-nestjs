import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema'; // Đảm bảo tên schema chính xác
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product> // Đảm bảo tên model chính xác
  ) {}

  async create(createProductDto: CreateProductDto) {
    const {
      title,
      slug,
      description,
      code,
      brand,
      thumb,
      images,
      price,
      discount,
      category,
      status,
      sold,
      colors,
      ratings,
      totalratings,
      tags
    } = createProductDto;

    try {
      const product = new this.productModel({
        title,
        slug,
        description,
        code,
        brand,
        thumb,
        images,
        price,
        discount,
        category,
        status: status || 1, // Assuming default 1 as 'Còn hàng'
        sold: sold || 0,
        colors,
        ratings,
        totalratings: totalratings || 0,
        tags
      });

      await product.save();

      return { _id: product._id.toString() };
    } catch (error) {
      throw new Error('Error creating product: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
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
    if (filter.category) {
      filter.category = { $in: filter.category };
    }

    if (filter.brand) {
      filter.brand = { $in: filter.brand };
    }


    const totalItems = (await this.productModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.productModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate({
        path: 'brand',
        select: '_id title' 
      })
      .populate({
          path: 'category',
          select: '_id title' 
      })
      .populate({
          path: 'colors',
          select: '_id title' 
      });

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
    return this.productModel.findById(id);
  }

  async update(updateProductDto: UpdateProductDto) {
    const { _id } = updateProductDto;
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateProductDto> = { ...updateProductDto };

      // Remove _id from the update payload
      delete updatePayload._id;

      const result = await this.productModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy sản phẩm');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật sản phẩm: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.productModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
