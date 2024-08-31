import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { title, image } = createCategoryDto;

    try {
      const category = new this.categoryModel({
        title,
        image,
      });

      await category.save();

      return { _id: category._id.toString() };
    } catch (error) {
      throw new Error('Error creating category');
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.categoryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.categoryModel
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
    return this.categoryModel.findById(id);
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const { _id, title, image } = updateCategoryDto;

    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

   

    try {
      const updatePayload: Partial<UpdateCategoryDto> = {};
      if (title) updatePayload.title = title;
      if (image) updatePayload.image = image;

      const result = await this.categoryModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy danh mục');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật danh mục: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.categoryModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
