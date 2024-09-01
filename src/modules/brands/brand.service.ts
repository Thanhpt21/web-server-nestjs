import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Brand } from './schemas/brand.schema';
import { Category } from '../categories/schemas/category.schema';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import aqp from 'api-query-params';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const { title, image, category } = createBrandDto;

    try {
      // Tạo mới một Brand
      const brand = new this.brandModel({ title, image, category });
      await brand.save();


      return { _id: brand._id.toString() };
    } catch (error) {
      throw new BadRequestException('Error creating brand: ' + error.message);
    }
  }

  async update(updateBrandDto: UpdateBrandDto) {
    const { _id, title, image, category } = updateBrandDto;

    if (!mongoose.isValidObjectId(_id)) {
        throw new BadRequestException('ID không hợp lệ');
    }

    try {
        const existingBrand = await this.brandModel.findById(_id);
        if (!existingBrand) {
            throw new BadRequestException('Brand không tồn tại');
        }

    
        // Tạo payload cập nhật cho brand
        const updatePayload: Partial<UpdateBrandDto> = {};
        if (title) updatePayload.title = title;
        if (image) updatePayload.image = image;
        if (category) updatePayload.category = category;

        // Cập nhật Brand
        await this.brandModel.updateOne({ _id }, { $set: updatePayload });


        return { success: true };
    } catch (error) {
        throw new BadRequestException('Error updating brand: ' + error.message);
    }
  }


  async findAll(query: string, current: number, pageSize: number, category: string) {
    // Giữ nguyên phần tìm kiếm và phân trang
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

      if (filter.category) {
        filter.category = { $in: filter.category }; // Giả sử filter.category là mảng ID của danh mục
    }

    const totalItems = await this.brandModel.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.brandModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .populate({
        path: 'category',
        select: '_id title',
      })
      .exec();

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
    return this.brandModel.findById(id);
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      // Xóa Brand
      await this.brandModel.deleteOne({ _id: id });

      // Cập nhật Category để xóa Brand khỏi trường brands
      await this.categoryModel.updateMany(
        { brands: id },
        { $pull: { brands: id } }
      );

      return { success: true };
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }


  async findBrandsByCategoryId(categoryId: string) {
    if (!mongoose.isValidObjectId(categoryId)) {
      throw new BadRequestException('ID danh mục không hợp lệ');
    }

    try {
      // Tìm các thương hiệu có chứa ID danh mục trong trường category
      const brands = await this.brandModel.find({ category: categoryId }).exec();

      return brands;
    } catch (error) {
      throw new BadRequestException('Error fetching brands: ' + error.message);
    }
  }
}
