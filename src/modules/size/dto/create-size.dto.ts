import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSizeDto {
    @IsString({ message: "Title phải là một chuỗi" })
    @IsNotEmpty({ message: "Title không được để trống" })
    title: string;

}
