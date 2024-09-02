import { IsArray, IsEnum, IsMongoId, IsOptional, IsNumber, IsString, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class UpdateOrderDto {

    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  @IsOptional()
  products?: ProductDto[];

  @IsOptional()
  status?: 1 | 2 | 3 | 4;

  @IsString()
  @IsOptional()
  address?: string;

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
  @IsOptional()
  methodPayment?: number;

  @IsEnum([1, 2])
  @IsOptional()
  deliveryMethod?: number;

  @IsMongoId()
  @IsOptional()
  orderBy?: mongoose.Schema.Types.ObjectId;
}

class ProductDto {
  @IsMongoId()
  @IsOptional()
  product?: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @IsOptional()
  quantity?: number;

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

  @IsString()
  @IsOptional()
  title?: string;
}
