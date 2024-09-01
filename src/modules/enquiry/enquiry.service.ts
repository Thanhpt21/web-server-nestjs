import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { Enquiry } from './schemas/enquiry.schema'; // Đảm bảo tên schema chính xác
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class EnquiriesService {
  constructor(
    @InjectModel(Enquiry.name) private enquiryModel: Model<Enquiry> // Đảm bảo tên model chính xác
  ) {}

  async create(createEnquiryDto: CreateEnquiryDto) {
    const { name, phone, email, comment, status } = createEnquiryDto;

    try {

        const enquiry = new this.enquiryModel({
            name,
            phone,
            email,
            comment,
            status: status || 1,
        });

        await enquiry.save();

        return { _id: enquiry._id.toString() };
    } catch (error) {
        throw new Error('Error creating enquiry: ' + error.message); // Cung cấp thông tin lỗi chi tiết hơn
    }
}


  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    if (filter.status) {
      filter.status = { $in: filter.status };
  }

    const totalItems = (await this.enquiryModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (+current - 1) * (+pageSize);

    const data = await this.enquiryModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any);

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems,
      },
      data,
    };
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('ID không hợp lệ');
    }
    return this.enquiryModel.findById(id);
  }

  async update(updateEnquiryDto: UpdateEnquiryDto) {
    const { _id } = updateEnquiryDto;
    if (!mongoose.isValidObjectId(_id)) {
      throw new BadRequestException('ID không hợp lệ');
    }

    try {
      const updatePayload: Partial<UpdateEnquiryDto> = {};
      if (updateEnquiryDto.status) updatePayload.status = updateEnquiryDto.status;

      const result = await this.enquiryModel.updateOne(
        { _id },
        { $set: updatePayload }
      );

      if (result.matchedCount === 0) {
        throw new BadRequestException('Không tìm thấy enquiry');
      }
      if (result.modifiedCount === 0) {
        throw new BadRequestException('Không có thay đổi nào được thực hiện hoặc không có trường nào cần cập nhật');
      }

      return { success: true };
    } catch (error) {
      throw new Error('Lỗi khi cập nhật enquiry: ' + error.message);
    }
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.enquiryModel.deleteOne({ _id: id });
    } else {
      throw new BadRequestException('ID không hợp lệ');
    }
  }
}
