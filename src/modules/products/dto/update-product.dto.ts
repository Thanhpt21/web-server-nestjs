import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

export class UpdateProductDto {

    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    code?: string;

    @IsMongoId()
    @IsOptional()
    brand?: string;

    @IsString()
    @IsOptional()
    thumb?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    discount?: number;

    @IsMongoId()
    @IsOptional()
    category?: string;

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
    @Type(() => VariantDto)
    @IsOptional()
    variants?: VariantDto[];

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

class VariantDto {
    @IsArray()
    @IsMongoId({ each: true })
    colors: string[];

    @IsNumber()
    price: number;

    @IsNumber()
    discount: number;

    @IsString()
    thumb: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsString()
    title: string;

    @IsString()
    sku: string;
}
