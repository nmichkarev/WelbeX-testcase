import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [PostsController],
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostsService]
})
export class PostsModule {}
