import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBrandDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

    @IsString({ message: "Image phải là một chuỗi" })
    @IsOptional() // Cho phép trường này là tùy chọn
    image?: string;

    @IsArray({ message: "Category phải là một mảng" })
    @IsMongoId({ each: true, message: "Mỗi phần tử trong mảng category phải là một ObjectId hợp lệ" })
    category: mongoose.Schema.Types.ObjectId[]; // Sử dụng mảng ObjectId từ Mongoose
}
