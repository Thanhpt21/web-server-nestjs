import { IsString, IsNumber, IsOptional, IsDateString, Min, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateCouponDto {
    @IsMongoId({message: "_Id không hợp lệ"})
    @IsNotEmpty({ message: "Id không được để trống" })
    _id: string;

    @IsOptional()
    @IsString({ message: "Tên coupon phải là một chuỗi" })
    name?: string;

    @IsOptional()
    @IsDateString({}, { message: "Ngày hết hạn phải là một ngày hợp lệ" })
    expiry?: Date;

    @IsOptional()
    @IsNumber({}, { message: "Giá trị giảm giá phải là một số" })
    @Min(0, { message: "Giá trị giảm giá phải lớn hơn hoặc bằng 0" })
    discount?: number;

    @IsOptional()
    @IsNumber({}, { message: "Giá tối thiểu phải là một số" })
    @Min(0, { message: "Giá tối thiểu phải lớn hơn hoặc bằng 0" })
    minPrice?: number;

    @IsOptional()
    @IsNumber({}, { message: "Giới hạn sử dụng phải là một số" })
    @Min(0, { message: "Giới hạn sử dụng phải lớn hơn hoặc bằng 0" })
    useLimit?: number;

    @IsOptional()
    @IsNumber({}, { message: "Số lần đã sử dụng phải là một số" })
    @Min(0, { message: "Số lần đã sử dụng phải lớn hơn hoặc bằng 0" })
    useCount?: number;
}
