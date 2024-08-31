import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

    @IsOptional()
    @IsString({ message: "Image phải là một chuỗi" })
    image?: string;
}
