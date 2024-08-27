import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;

    @IsNotEmpty({message: "Password không được để trống"})
    password: string;

    @IsNotEmpty({message: "Tên không được để trống"})
    name: string;
}

export class CodeAuthDto {
    @IsNotEmpty({message: "_id không được để trống"})
    _id: string;

    @IsNotEmpty({message: "Code không được để trống"})
    code: string;


}

