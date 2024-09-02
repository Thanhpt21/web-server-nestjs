import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/product.module';
import { ColorsModule } from '../color/color.module';
import { CouponModule } from '../coupon/coupon.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    UsersModule,
    ProductsModule,
    ColorsModule,
    CouponModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
