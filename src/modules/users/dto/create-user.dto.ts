import { IsEmail, IsEmpty, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Tên không được để trống"})
    name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: "Email không đúng định dạng"})
    email: string;

    @IsNotEmpty({message: "Password không được để trống"})
    password: string;

    phone: string;
    address: string;
    image: string; 
}
