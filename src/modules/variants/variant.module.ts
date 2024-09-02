// src/variants/variants.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VariantsController } from './variant.controller';
import { VariantsService } from './variant.service';
import { Variant, VariantSchema } from './schemas/variant.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema'; // Nếu cần phải sử dụng Product schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Variant.name, schema: VariantSchema },
      { name: Product.name, schema: ProductSchema }
    ]),
  ],
  controllers: [VariantsController],
  providers: [VariantsService],
  exports: [VariantsService], 
})
export class VariantsModule {}
