import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class UpdateUserDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsString({ message: "Tên phải là một chuỗi" })
    name?: string;

    @IsOptional()
    @IsString({ message: "Số điện thoại phải là một chuỗi" })
    phone?: string;

    @IsOptional()
    @IsString({ message: "Địa chỉ phải là một chuỗi" })
    address?: string;

    @IsOptional()
    @IsString({ message: "Hình ảnh phải là một chuỗi" })
    image?: string;

    
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    cart?: CartItemDto[];

    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    wishlist?: string[];
}

export class CartItemDto {
    @IsMongoId({ message: 'Product ID không hợp lệ' })
    product: mongoose.Types.ObjectId;
  
    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: number;
  
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Color ID không hợp lệ' })
    colors?: mongoose.Types.ObjectId[];
  
    @IsNotEmpty({ message: 'Price không được để trống' })
    price: number;
  
    @IsOptional()
    @IsNotEmpty()
    discount?: number;
  
    @IsOptional()
    @IsString({ message: 'Thumb phải là một chuỗi' })
    thumb?: string;
  
    @IsOptional()
    @IsString({ message: 'Title phải là một chuỗi' })
    title?: string;
  }

