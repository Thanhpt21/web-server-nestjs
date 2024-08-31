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
  async uploadImages(files: Express.Multer.File[]): Promise<{ secure_url: string }[]> {
    const uploadPromises = files.map(file => {
      return new Promise<{ secure_url: string }>((resolve, reject) => {
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
    });

    return Promise.all(uploadPromises);
  }
}
