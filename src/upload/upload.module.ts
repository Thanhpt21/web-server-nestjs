import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { configureCloudinary } from '../config/cloudinary.config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [
    UploadService,
    {
      provide: 'APP_INIT',
      useFactory: async (configService: ConfigService) => {
        configureCloudinary(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class UploadModule {}