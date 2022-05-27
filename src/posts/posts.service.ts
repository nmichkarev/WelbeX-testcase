import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.model';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postRepository: typeof Post) {}
  
  async create(createPostDto: CreatePostDto, userId: number) {
    return this.postRepository.create({ ...createPostDto, userId });
  }

  async findAll() {
    return this.postRepository.findAll({ include: { model: User, attributes: { exclude: ['password', 'updatedAt', 'createdAt'] } } });
  }

  async findOne(id: number) {
    return this.postRepository.findByPk(id, { include: { model: User, attributes: { exclude: ['password', 'updatedAt', 'createdAt'] } } });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(id);

    post.set(updatePostDto);
    return post.save();
  }

  async remove(id: number) {
    return Post.destroy({ where: { id } });
  }
}
