import { BlogCategory } from '@/modules/blogCategories/schemas/blogcategory.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop()
    image: string;

    @Prop()
    description?: string;

    @Prop({
        type: [
            {
                _id: false, // Ngăn MongoDB tự động tạo _id cho mỗi phần tử trong mảng content
                title: { type: String, required: true },
                body: { type: String, required: true },
            },
        ],
    })
    content: { title: string; body: string }[];

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'BlogCategory' })
    category: MongooseSchema.Types.ObjectId[];

    @Prop({ default: 0 })
    numberViews: number;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ default: 0 })
    dislikes: number;

    @Prop({ default: 'Admin' })
    author: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User' })
    viewedBy: MongooseSchema.Types.ObjectId[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
