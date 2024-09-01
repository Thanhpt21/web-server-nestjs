import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateConfigDto {
    @IsString({ message: "Name phải là một chuỗi" })
    @IsNotEmpty({ message: "Name không được để trống" })
    name: string;


    @IsNotEmpty({ message: "Phone không được để trống" })
    phone: string;

    @IsEmail({}, { message: "Email phải là một địa chỉ email hợp lệ" })
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;

    @IsString({ message: "Address phải là một chuỗi" })
    @IsNotEmpty({ message: "Address không được để trống" })
    address: string;

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
