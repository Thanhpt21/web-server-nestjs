import {  IsOptional, IsString, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({message: "_Id không được để trống"})
    _id: string;

    @IsOptional()
    @IsString({ message: "Title phải là một chuỗi" })
    title?: string;

}
