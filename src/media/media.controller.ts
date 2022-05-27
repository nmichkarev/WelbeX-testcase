import { Express } from 'express';
import { Controller, HttpException, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, mediaFileFilter } from '../utils';
import { diskStorage } from 'multer'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Media')
@Controller('media')
export class MediaController {
    
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
          type: 'object',
          properties: {
            file: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      })
    @ApiResponse({ status: 200, type: String, description: 'Local file path' })
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/files',
            filename: editFileName
        }),
        fileFilter: mediaFileFilter
    }))
    @Post('upload')
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new HttpException('File save error', 500);
        return file.filename;
    }
}
