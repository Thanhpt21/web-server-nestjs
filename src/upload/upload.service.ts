import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  // Hàm upload một file
  async uploadImage(file: Express.Multer.File): Promise<{ secure_url: string }> {
   
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({ secure_url: result.secure_url });
          }
        },
      ).end(file.buffer);
    });
  }

  // Hàm upload nhiều file
  async uploadImages(files: Express.Multer.File[]): Promise<{data: string[] }> {
    // Tạo danh sách các lời hứa để tải lên
    const uploadPromises = files.map(file =>
        new Promise<string>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            ).end(file.buffer);
        })
    );

    // Đợi tất cả các lời hứa hoàn thành và thu thập các URL
    const urls = await Promise.all(uploadPromises);

    // Trả về dữ liệu theo định dạng mong muốn
    return {
        data: urls,
    };
}
}
