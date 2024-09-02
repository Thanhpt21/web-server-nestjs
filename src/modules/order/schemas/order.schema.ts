import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
    brand: MongooseSchema.Types.ObjectId;
  @Prop({
    type: [
      {
        product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        colors: { type: [MongooseSchema.Types.ObjectId], ref: 'Color', required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        thumb: { type: String, required: true },
        title: { type: String, required: true },
      },
    ],
    required: true,
  })
  @IsArray()
  products: {
    product: MongooseSchema.Types.ObjectId;
    quantity: number;
    colors: MongooseSchema.Types.ObjectId[];
    price: number;
    discount: number;
    thumb: string;
    title: string;
  }[];

  @Prop({
    type: Number,
    enum: [1, 2, 3, 4],
    default: 1,
  })
  status: Number; 

  @Prop({ type: String, required: true })
  @IsString()
  address: string;

  @Prop({ type: Number })
  @IsNumber()
  @IsOptional()
  total?: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Coupon' })
  @IsOptional()
  coupon?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Ship', default: null })
  @IsOptional()
  ship?: MongooseSchema.Types.ObjectId;


  @Prop({
    type: Number,
    required: true,
    enum: [1,2,3],
    default: 1,
  })
  @IsEnum([1,2])
  methodPayment: number;

  @Prop({
    type: Number,
    enum: [1,2],
    default: 1,
  })
  @IsEnum([1,2])
  deliveryMethod: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @IsOptional()
  orderBy?: MongooseSchema.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
