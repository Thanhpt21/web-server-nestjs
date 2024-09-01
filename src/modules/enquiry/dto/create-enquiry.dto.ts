import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateEnquiryDto {
    @IsString({ message: "Tên phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên không được để trống" })
    name: string;

    @IsString()
    @IsNotEmpty({ message: "Số điện thoại không được để trống" })
    phone: string;

    @IsEmail({}, { message: "Email không hợp lệ" })
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;

    @IsString({ message: "Bình luận phải là một chuỗi" })
    @IsOptional()
    comment?: string;

    @IsOptional()
    status?: 1 | 2 | 3;
}
