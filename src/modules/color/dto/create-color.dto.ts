import { IsString, IsNotEmpty } from 'class-validator';

export class CreateColorDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

    @IsNotEmpty({ message: "Mã màu không được để trống" })
    code: string;
}
