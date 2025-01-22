import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseInterceptors(FileInterceptor('file'))
export class UploadController {
  @Post()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    if (!file) {
      return {
        statusCode: 400,
        message: 'No file uploaded',
      };
    }

    const filePath = `/uploads/${file.filename}`;
    return {
      statusCode: 200,
      imageUrl: filePath,
    };
  }
}
