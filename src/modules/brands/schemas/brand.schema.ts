import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({ timestamps: true })
export class Brand {
    @Prop({ required: true })
    name: string;

    @Prop()
    image: string;

    @Prop()
    category: MongooseSchema.Types.ObjectId;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

