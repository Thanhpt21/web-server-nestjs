import { IsArray, IsOptional, IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

    @IsOptional()
    @IsString({ message: "Image phải là một chuỗi" })
    image?: string;

    @IsOptional()
    @IsArray({ message: "Brands phải là một mảng" })
    @IsMongoId({ each: true, message: "Mỗi phần tử trong Brands phải là một ObjectId hợp lệ" })
    brands?: string[];
}
