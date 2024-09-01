import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    expiry: Date;

    @Prop({ required: true, type: Number })
    discount: number;

    @Prop({ required: true, type: Number })
    minPrice: number;

    @Prop({ type: Number, default: 0 })
    useLimit: number;

    @Prop({ type: Number, default: 0 })
    useCount: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
