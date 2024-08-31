import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: true })
    title: string; // Đảm bảo tên trường là 'title'

    @Prop()
    image: string;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category' })
    category: MongooseSchema.Types.ObjectId[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
