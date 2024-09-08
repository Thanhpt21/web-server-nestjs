import { IsArray, IsEmail, IsEmpty, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateUserDto {
    @IsNotEmpty({message: "Tên không được để trống"})
    name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Email không đúng định dạng"})
    email: string;

    @IsNotEmpty({message: "Password không được để trống"})
    password: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
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
    product: mongoose.Schema.Types.ObjectId;
  
    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: number;
  
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true, message: 'Color ID không hợp lệ' })
    colors?: mongoose.Schema.Types.ObjectId[];
  
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