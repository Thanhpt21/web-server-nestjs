import {  IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateSizeDto {
    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsNotEmpty({ message: "Title không được để trống" })
    @IsString({ message: "Title phải là một chuỗi" })
    title: string;
}
