import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsNotEmpty()
  products: ProductDto[];

  @IsOptional()
  status?: 1 | 2 | 3 | 4;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsOptional()
  total?: number;

  @IsMongoId()
  @IsOptional()
  coupon?: mongoose.Schema.Types.ObjectId;

  @IsMongoId()
  @IsOptional()
  ship?: mongoose.Schema.Types.ObjectId;

  @IsEnum([1, 2, 3])
  @IsNotEmpty()
  methodPayment: number;

  @IsEnum([1, 2])
  @IsOptional()
  deliveryMethod?: number;

  @IsMongoId()
  @IsOptional()
  orderBy?: mongoose.Schema.Types.ObjectId;
}

class ProductDto {
  @IsMongoId()
  @IsNotEmpty()
  product: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  colors: mongoose.Schema.Types.ObjectId[];

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  discount: number;

  @IsString()
  @IsNotEmpty()
  thumb: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
