import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsEnum } from 'class-validator';
import { Types } from 'mongoose'; // If you use Mongoose

enum Status {
  IN_STOCK = "Còn hàng",
  OUT_OF_STOCK = "Hết hàng",
}

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title không được để trống' })
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'Description không được để trống' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Mã sản phẩm không được để trống' })
  @IsString()
  code: string;

  @IsOptional() 
  brand?: Types.ObjectId;

  @IsNotEmpty({ message: 'Thumb không được để trống' })
  @IsString()
  thumb: string;

  @IsNotEmpty({ message: 'Price không được để trống' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: 'Discount không được để trống' })
  @IsNumber()
  discount: number;

  @IsOptional() 
  category?: Types.ObjectId;

  @IsOptional() 
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsNumber()
  sold?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional() 
  color?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  ratings?: Array<{
    star: number;
    comment: string;
    postedby: Types.ObjectId;
    updatedAt?: Date;
  }>;

  @IsOptional()
  @IsNumber()
  totalratings?: number;

  @IsOptional()
  @IsArray()
  variants?: Array<{
    color?: Types.ObjectId;
    price?: number;
    discount?: number;
    thumb?: string;
    images?: string[];
    title?: string;
    sku?: string;
  }>;

  @IsOptional()
  @IsArray()
  tags?: string[];
}