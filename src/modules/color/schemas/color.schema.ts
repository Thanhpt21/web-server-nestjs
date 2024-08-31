import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ColorDocument = HydratedDocument<Color>;

@Schema({ timestamps: true })
export class Color {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    code: string; // Trường mã màu
}

export const ColorSchema = SchemaFactory.createForClass(Color);
