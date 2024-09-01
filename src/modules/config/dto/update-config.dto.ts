import { IsString, IsOptional, IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateConfigDto {

    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsOptional()
    @IsString({ message: "Name phải là một chuỗi" })
    name?: string;

    @IsOptional()
    @IsString({ message: "Phone phải là một chuỗi" })
    phone?: string;

    @IsOptional()
    @IsEmail({}, { message: "Email phải là một địa chỉ email hợp lệ" })
    email?: string;

    @IsOptional()
    @IsString({ message: "Address phải là một chuỗi" })
    address?: string;

    @IsOptional()
    @IsString({ message: "Facebook phải là một chuỗi" })
    facebook?: string;

    @IsOptional()
    @IsString({ message: "Zalo phải là một chuỗi" })
    zalo?: string;

    @IsOptional()
    @IsString({ message: "Instagram phải là một chuỗi" })
    instagram?: string;

    @IsOptional()
    @IsString({ message: "Tiktok phải là một chuỗi" })
    tiktok?: string;

    @IsOptional()
    @IsString({ message: "Youtube phải là một chuỗi" })
    youtube?: string;

    @IsOptional()
    @IsString({ message: "Messenger phải là một chuỗi" })
    messenger?: string;

    @IsOptional()
    @IsString({ message: "Logo phải là một chuỗi" })
    logo?: string; // URL or path to the logo image

    @IsOptional()
    @IsString({ message: "Favicon phải là một chuỗi" })
    favicon?: string; // URL or path to the favicon image
}
