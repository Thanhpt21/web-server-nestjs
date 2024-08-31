import { Brand } from '@/modules/brands/schemas/brand.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
    @Prop({ required: true })
    title: string;

    @Prop()
    image: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Brand.name }] })
    brands: MongooseSchema.Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
