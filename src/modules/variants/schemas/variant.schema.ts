// src/variants/schemas/variant.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Variant {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  product: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Color' })
  colors: mongoose.Schema.Types.ObjectId[];

  @Prop()
  price: number;

  @Prop()
  discount: number;

  @Prop()
  thumb: string;

  @Prop([String])
  images: string[];

  @Prop()
  title: string;

  @Prop()
  code: string;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
