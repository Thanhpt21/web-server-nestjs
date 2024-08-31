import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { BlogCategory, BlogCategoryDocument } from './schemas/blogcategory.schema';
import { CreateBlogCategoryDto } from './dto/create-blogcategory.dto';
import { UpdateCategoryDto } from './dto/update-blogcategory.dto';
import aqp from 'api-query-params';

@Injectable()
export class BlogCategoriesService {
    constructor(
        @InjectModel(BlogCategory.name) private readonly blogCategoryModel: Model<BlogCategoryDocument>
    ) {}

    async create(createBlogCategoryDto: CreateBlogCategoryDto) {
        const { title } = createBlogCategoryDto;

        try {
            const blogCategory = new this.blogCategoryModel({
                title,
            });

            await blogCategory.save();

            return { _id: blogCategory._id.toString() };
        } catch (error) {
            throw new BadRequestException('Lỗi khi tạo danh mục blog');
        }
    }

    async findAll(query: string, current: number, pageSize: number) {
        const { filter, sort } = aqp(query);
    
        if (filter.current) delete filter.current;
        if (filter.pageSize) delete filter.pageSize;
    
        if (!current) current = 1;
        if (!pageSize) pageSize = 10;
    
        const totalItems = (await this.blogCategoryModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const skip = (+current - 1) * (+pageSize);
    
        const data = await this.blogCategoryModel
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

    async findOne(id: string): Promise<BlogCategory> {
        const category = await this.blogCategoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(updateCategoryDto: UpdateCategoryDto) {
        const { _id, title } = updateCategoryDto;

        if (!mongoose.isValidObjectId(_id)) {
            throw new BadRequestException('ID không hợp lệ');
          }
        try {
            const updatePayload: Partial<UpdateCategoryDto> = {};
            if (title) updatePayload.title = title;

            const result = await this.blogCategoryModel.updateOne(
                { _id },
                { $set: updatePayload }
            );

            if (result.matchedCount === 0) {
                throw new NotFoundException('Không tìm thấy danh mục');
            }
            if (result.modifiedCount === 0) {
                throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
            }

            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật danh mục: ' + error.message);
        }
    }

    async remove(id: string): Promise<void> {
        const result = await this.blogCategoryModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
    }
}
