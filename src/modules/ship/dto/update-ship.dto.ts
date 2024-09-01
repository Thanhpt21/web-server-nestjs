import { IsString, IsOptional, IsNumber, Min, IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateShipDto {

    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsString({ message: 'Province phải là một chuỗi' })
    @IsOptional()
    province?: string;

    @IsNumber({}, { message: 'Price phải là một số' })
    @IsOptional()
    @Min(0, { message: 'Price phải lớn hơn hoặc bằng 0' })
    price?: number;
}
