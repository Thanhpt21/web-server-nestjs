// src/variants/dto/update-variant.dto.ts

import { IsArray, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateVariantDto {
  @IsMongoId()
  @IsOptional()
  _id?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsString()
  product?: mongoose.Schema.Types.ObjectId;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  colors?: mongoose.Schema.Types.ObjectId[];

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  thumb?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  code?: string;
}
