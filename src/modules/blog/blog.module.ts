import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { BlogsService } from './blog.service';
import { BlogsController } from './blog.controller';
import { BlogCategory, BlogCategorySchema } from '../blogCategories/schemas/blogcategory.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Blog.name, schema: BlogSchema },
            { name: BlogCategory.name, schema: BlogCategorySchema } // Inject BlogCategory schema for category validation
        ])
    ],
    controllers: [BlogsController],
    providers: [BlogsService],
    exports: [BlogsService]
})
export class BlogModule {}
