import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateShipDto {
    @IsString({ message: 'Province phải là một chuỗi' })
    @IsNotEmpty({ message: 'Province không được để trống' })
    province: string;

    @IsNumber({}, { message: 'Price phải là một số' })
    @IsNotEmpty({ message: 'Price không được để trống' })
    @Min(0, { message: 'Price phải lớn hơn hoặc bằng 0' })
    price: number;
}
