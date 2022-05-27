import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostEditGuard } from './post-edit.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import * as PostModel from './post.model';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiResponse({ status: 200, type: PostModel.Post })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    const { user } = req;
    return this.postsService.create(createPostDto, user.id);
  }

  @ApiResponse({ status: 200, type: [PostModel.Post] })
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @ApiResponse({ status: 200, type: PostModel.Post })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @ApiResponse({ status: 200, type: PostModel.Post })
  @UseGuards(JwtAuthGuard, PostEditGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard, PostEditGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
