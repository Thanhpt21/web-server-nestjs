import { IsString, IsNotEmpty, IsOptional, IsArray, IsMongoId, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class CreateBlogDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

    @IsString({ message: "image phải là một chuỗi" })
    @IsNotEmpty({ message: "image không được để trống" })
    image: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    content?: { title: string; body: string }[];

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    category?: mongoose.Schema.Types.ObjectId[];

    @IsNumber({}, { message: "NumberViews phải là một số" })
    @IsOptional()
    numberViews?: number;

    @IsNumber({}, { message: "Likes phải là một số" })
    @IsOptional()
    likes?: number;

    @IsNumber({}, { message: "Dislikes phải là một số" })
    @IsOptional()
    dislikes?: number;

    @IsString()
    @IsOptional()
    author?: string;

    @IsArray()
    @IsMongoId({ each: true })
    @IsOptional()
    viewedBy?: mongoose.Schema.Types.ObjectId[];
}
