import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnquiriesService } from './enquiry.service';
import { EnquiriesController } from './enquiry.controller';
import { Enquiry, EnquirySchema } from './schemas/enquiry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enquiry.name, schema: EnquirySchema }]),
  ],
  controllers: [EnquiriesController],
  providers: [EnquiriesService],
  exports: [EnquiriesService],
})
export class EnquiryModule {}
