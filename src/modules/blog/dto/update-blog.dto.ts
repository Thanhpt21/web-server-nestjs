import { IsString, IsOptional, IsArray, IsMongoId, IsNumber, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateBlogDto {
    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({message: "_Id không được để trống"})
    _id: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    image?: string;

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
