import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Variant } from './schemas/variant.schema';
import { Product } from '../products/schemas/product.schema';
import aqp from 'api-query-params'; // Giả sử bạn đã cài đặt và sử dụng thư viện này

@Injectable()
export class VariantsService {
  constructor(
    @InjectModel(Variant.name) private variantModel: Model<Variant>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createVariantDto: CreateVariantDto) {
    const { product, ...variantData } = createVariantDto;

    if (!await this.productModel.findById(product)) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    const variant = new this.variantModel({ product, ...variantData });
    await variant.save();

    return { _id: variant._id.toString() };
  }

  async update(updateVariantDto: UpdateVariantDto) {
    const { _id } = updateVariantDto;
    if (!_id || !await this.variantModel.findById(_id)) {
      throw new BadRequestException('Biến thể không tồn tại');
    }

    const { product, ...updateData } = updateVariantDto;

    if (product && !await this.productModel.findById(product)) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    const result = await this.variantModel.updateOne({ _id }, { $set: updateData });

    if (result.matchedCount === 0) {
      throw new BadRequestException('Biến thể không tìm thấy');
    }

    return { success: true };
  }

  async remove(id: string) {
    if (!await this.variantModel.findById(id)) {
      throw new BadRequestException('Biến thể không tồn tại');
    }

    const result = await this.variantModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new BadRequestException('Không thể xóa biến thể');
    }

    return { success: true };
  }

  async findAll(productId: string, query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // Thêm điều kiện lọc theo sản phẩm
    filter.product = productId;

    // Xử lý lọc và phân trang
    const totalItems = (await this.variantModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.variantModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate({
        path: 'product',
        select: '_id title'  // Điều chỉnh tùy thuộc vào cấu trúc của schema Product
      })
      .populate({
        path: 'colors',
        select: '_id title code'
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

  async findOne(productId: string, id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    // Tìm biến thể theo ID và kiểm tra thuộc sản phẩm nào
    const variant = await this.variantModel
      .findOne({ _id: id, product: productId })
      .populate({
        path: 'product',
        select: '_id title'  // Điều chỉnh tùy thuộc vào cấu trúc của schema Product
      });

    if (!variant) {
      throw new BadRequestException('Biến thể không tồn tại hoặc không thuộc sản phẩm này');
    }

    return variant;
  }

  async findByProductId(productId: string) {
    if (!await this.productModel.findById(productId)) {
      throw new BadRequestException('Sản phẩm không tồn tại');
    }

    const variants = await this.variantModel
      .find({ product: productId })
      .populate({
        path: 'product',
        select: '_id title'  // Điều chỉnh tùy thuộc vào cấu trúc của schema Product
      })
      .populate({
        path: 'colors',
        select: '_id title code'
      });

    return variants;
  }
}
