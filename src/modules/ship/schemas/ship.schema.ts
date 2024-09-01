import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShipDocument = HydratedDocument<Ship>;

@Schema({ timestamps: true })
export class Ship {
    @Prop({ required: true })
    province: string; // Tỉnh thành

    @Prop({ required: true, type: Number })
    price: number; // Giá vận chuyển
}

export const ShipSchema = SchemaFactory.createForClass(Ship);

