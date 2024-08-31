import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogCategory, BlogCategorySchema } from './schemas/blogcategory.schema';
import { BlogCategoriesService } from './blogcategories.service';
import { BlogCategoriesController } from './blogcategories.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BlogCategory.name, schema: BlogCategorySchema }])
    ],
    controllers: [BlogCategoriesController],
    providers: [BlogCategoriesService],
    exports: [BlogCategoriesService]
})
export class BlogCategoriesModule {}
