import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsMongoId({ message: "_id không hợp lệ" })
    @IsNotEmpty({ message: "_id không được để trống" })
    _id: string;

    @IsOptional()
    @IsString({ message: "Tên phải là một chuỗi" })
    name?: string;

    @IsOptional()
    @IsString({ message: "Số điện thoại phải là một chuỗi" })
    phone?: string;

    @IsOptional()
    @IsString({ message: "Địa chỉ phải là một chuỗi" })
    address?: string;

    @IsOptional()
    @IsString({ message: "Hình ảnh phải là một chuỗi" })
    image?: string;
}
