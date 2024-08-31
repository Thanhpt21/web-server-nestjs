import { IsString, IsOptional, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateBrandDto {
    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({message: "_Id không được để trống"})
    _id: string;

    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({message: "Title không được để trống"})
    @IsOptional() 
    title?: string;

    @IsString({ message: "Image phải là một chuỗi" })
    @IsOptional() 
    image?: string;

    @IsArray({ message: "Category phải là một mảng" })
    @IsMongoId({ each: true, message: "Mỗi phần tử trong mảng category phải là một ObjectId hợp lệ" })
    @IsOptional() 
    category?: mongoose.Schema.Types.ObjectId[]; 
}
