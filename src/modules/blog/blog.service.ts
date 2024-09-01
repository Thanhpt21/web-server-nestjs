import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import aqp from 'api-query-params';
import { BlogCategory } from '../blogCategories/schemas/blogcategory.schema';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
        @InjectModel(BlogCategory.name) private readonly blogCategoryModel: Model<BlogCategory> 
    ) {}

    async create(createBlogDto: CreateBlogDto) {
        const { title, image, description, content, category, author } = createBlogDto;

        try {
            const blog = new this.blogModel({
                title,
                image,
                description,
                content,
                category,
                numberViews: 0,
                likes: 0,
                dislikes: 0,
                author: author || 'Admin',
                viewedBy: []
            });

            await blog.save();

            return { _id: blog._id.toString() };
        } catch (error) {
            throw new BadRequestException('Lỗi khi tạo blog');
        }
    }

    async findAll(query: string, current: number, pageSize: number,  category: string) {
        const { filter, sort } = aqp(query);

        if (filter.current) delete filter.current;
        if (filter.pageSize) delete filter.pageSize;

        if (!current) current = 1;
        if (!pageSize) pageSize = 10;

        if (filter.category) {
            filter.category = { $in: filter.category }; // Giả sử filter.category là mảng ID của danh mục
        }

        const totalItems = await this.blogModel.countDocuments(filter).exec();
        const totalPages = Math.ceil(totalItems / pageSize);
        const skip = (+current - 1) * (+pageSize);

        const data = await this.blogModel
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

    async findOne(id: string): Promise<Blog> {
        const blog = await this.blogModel
            .findById(id)
            .populate({
                path: 'category',
                select: '_id title'
                
            })
            .exec();
        
        if (!blog) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
        return blog;
    }

    async update(updateBlogDto: UpdateBlogDto) {
        const { _id, content, category } = updateBlogDto;
        if (!mongoose.isValidObjectId(_id)) {
            throw new BadRequestException('ID không hợp lệ');
        }

        try {
            const updatePayload: Partial<UpdateBlogDto> = {};

            if (updateBlogDto.title) updatePayload.title = updateBlogDto.title;
            if (updateBlogDto.image) updatePayload.image = updateBlogDto.image;
            if (updateBlogDto.description) updatePayload.description = updateBlogDto.description;
            if (updateBlogDto.content) updatePayload.content = content;
            if (updateBlogDto.category) { 
                updatePayload.category = category;
            }
            if (updateBlogDto.numberViews) updatePayload.numberViews = updateBlogDto.numberViews;
            if (updateBlogDto.likes) updatePayload.likes = updateBlogDto.likes;
            if (updateBlogDto.dislikes) updatePayload.dislikes = updateBlogDto.dislikes;
            if (updateBlogDto.author) updatePayload.author = updateBlogDto.author;
            if (updateBlogDto.viewedBy) updatePayload.viewedBy = updateBlogDto.viewedBy;

            const result = await this.blogModel.updateOne(
                { _id},
                { $set: updatePayload }
            );

            if (result.matchedCount === 0) {
                throw new NotFoundException('Không tìm thấy blog');
            }
            if (result.modifiedCount === 0) {
                throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
            }

            return { success: true };
        } catch (error) {
            throw new Error('Lỗi khi cập nhật blog: ' + error.message);
        }
    }

    async remove(id: string): Promise<void> {
        const result = await this.blogModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Blog with ID ${id} not found`);
        }
    }
}
