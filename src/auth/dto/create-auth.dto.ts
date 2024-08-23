import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Email không được để trống"})
    email: string;

    @IsNotEmpty({message: "Password không được để trống"})
    password: string;

    @IsNotEmpty({message: "Tên không được để trống"})
    name: string;
}
