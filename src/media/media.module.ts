import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
 
@Module({
  controllers: [MediaController]
})
export class MediaModule {}
