// src/variants/dto/create-variant.dto.ts

import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateVariantDto {
 @IsNotEmpty()
  @IsString()
  product: mongoose.Schema.Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  colors?: mongoose.Schema.Types.ObjectId[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsString()
  @IsNotEmpty()
  thumb: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  images: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
