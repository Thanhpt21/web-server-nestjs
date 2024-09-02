import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, lowercase: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    code: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
    brand: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    thumb: string;

    @Prop({ type: [String] })
    images: string[];

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    discount: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
    category: MongooseSchema.Types.ObjectId;

    @Prop({ default: 1, enum: [1, 2] })
    status: number;

    @Prop({ default: 0 })
    sold: number;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Color' })
    colors: MongooseSchema.Types.ObjectId[];

    @Prop({
        type: [
            {
                star: { type: Number },
                comment: { type: String },
                postedby: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
                updatedAt: { type: Date },
            },
        ],
    })
    ratings: {
        star: number;
        comment: string;
        postedby: MongooseSchema.Types.ObjectId;
        updatedAt: Date;
    }[];

    @Prop({ default: 0 })
    totalratings: number;

    @Prop({ type: [String] })
    tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
