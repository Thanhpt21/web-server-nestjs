import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransformInterceptor } from './core/transform.interceptor';

import { UsersModule } from '@/modules/users/users.module';
import { UploadModule } from '@/upload/upload.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { BlogCategoriesModule } from '@/modules/blogCategories/blogcategories.module';
import { ColorsModule } from '@/modules/color/color.module';
import { SizesModule } from './modules/size/size.module';
import { BrandsModule } from './modules/brands/brand.module';
import { BlogModule } from './modules/blog/blog.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { ShipModule } from './modules/ship/ship.module';
import { EnquiryModule } from './modules/enquiry/enquiry.module';
import { ConfigsModule } from './modules/config/config.module';
import { StoreModule } from './modules/store/store.module';



@Module({
  imports: [
    UploadModule,
    UsersModule,
    CategoriesModule,
    BlogCategoriesModule,
    ColorsModule,
    SizesModule,
    BrandsModule,
    BlogModule,
    CouponModule,
    ShipModule,
    EnquiryModule,
    ConfigsModule,
    StoreModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
     
    }),
  ],
  controllers: [AppController],
  providers: [AppService, 
    { 
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { 
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
],
})
export class AppModule { }
