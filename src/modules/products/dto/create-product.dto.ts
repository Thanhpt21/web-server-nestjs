import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsMongoId()
    @IsNotEmpty()
    brand: string;

    @IsString()
    @IsNotEmpty()
    thumb: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    discount: number;

    @IsMongoId()
    @IsNotEmpty()
    category: string;

    @IsEnum([1, 2])
    @IsOptional()
    status?: number;

    @IsNumber()
    @IsOptional()
    sold?: number;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    colors?: mongoose.Schema.Types.ObjectId[];


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingDto)
    @IsOptional()
    ratings?: RatingDto[];

    @IsNumber()
    @IsOptional()
    totalratings?: number;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];
}

class RatingDto {
  @IsNumber()
  star: number;

  @IsString()
  comment: string;

  @IsMongoId()
  postedby: string;

  @IsOptional()
  updatedAt?: Date;
}

