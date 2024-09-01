import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateCouponDto {
    @IsString({ message: "Tên coupon phải là một chuỗi" })
    @IsNotEmpty({ message: "Tên coupon không được để trống" })
    name: string;

    @IsDateString({}, { message: "Ngày hết hạn phải là một ngày hợp lệ" })
    @IsNotEmpty({ message: "Ngày hết hạn không được để trống" })
    expiry: Date;

    @IsNumber({}, { message: "Giá trị giảm giá phải là một số" })
    @IsNotEmpty({ message: "Giá trị giảm giá không được để trống" })
    @Min(0, { message: "Giá trị giảm giá phải lớn hơn hoặc bằng 0" })
    discount: number;

    @IsNumber({}, { message: "Giá tối thiểu phải là một số" })
    @IsNotEmpty({ message: "Giá tối thiểu không được để trống" })
    @Min(0, { message: "Giá tối thiểu phải lớn hơn hoặc bằng 0" })
    minPrice: number;

    @IsOptional()
    @IsNumber({}, { message: "Giới hạn sử dụng phải là một số" })
    @Min(0, { message: "Giới hạn sử dụng phải lớn hơn hoặc bằng 0" })
    useLimit?: number;

    @IsOptional()
    @IsNumber({}, { message: "Số lần đã sử dụng phải là một số" })
    @Min(0, { message: "Số lần đã sử dụng phải lớn hơn hoặc bằng 0" })
    useCount?: number;
}
