import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // Endpoint để upload một file
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No file uploaded');
    }
    return this.uploadService.uploadImage(file);
  }

  // Endpoint để upload nhiều file
  @Post('images')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {

    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }
    return this.uploadService.uploadImages(files);
  }
}
