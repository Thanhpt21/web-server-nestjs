
import { IsString, IsOptional, IsEmail, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateEnquiryDto {

    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsString({ message: "Tên phải là một chuỗi" })
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEmail({}, { message: "Email không hợp lệ" })
    @IsOptional()
    email?: string;

    @IsString({ message: "Bình luận phải là một chuỗi" })
    @IsOptional()
    comment?: string;

    @IsOptional()
    status?: 1 | 2 | 3;
}
