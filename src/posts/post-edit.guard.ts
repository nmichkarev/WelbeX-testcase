import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostsService } from './posts.service';

@Injectable()
export class PostEditGuard implements CanActivate {
  constructor(private readonly postsService: PostsService){}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const postId = request.params.id;
    if (!userId) throw new UnauthorizedException();
    return this.givePermission(userId, postId);
  }

  async givePermission(userId: number, postId: number) {
    const post = await this.postsService.findOne(postId);
    return post.userId === userId;
  }
}