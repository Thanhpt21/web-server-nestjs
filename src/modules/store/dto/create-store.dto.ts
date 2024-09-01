import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateStoreDto {
    @IsString({ message: "Name phải là một chuỗi" })
    @IsNotEmpty({ message: "Name không được để trống" })
    name: string;

    @IsOptional()
    image?: string;

    @IsString({ message: "Phone phải là một chuỗi" })
    @IsNotEmpty({ message: "Phone không được để trống" })
    phone: string;

    @IsEmail({}, { message: "Email phải là một địa chỉ email hợp lệ" })
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;

    @IsString({ message: "Address phải là một chuỗi" })
    @IsNotEmpty({ message: "Address không được để trống" })
    address: string;


    @IsOptional()
    @IsString({ message: "Link phải là một chuỗi" })
    link?: string; 

    @IsOptional()
    @IsString({ message: "Iframe phải là một chuỗi" })
    iframe?: string; 
}
