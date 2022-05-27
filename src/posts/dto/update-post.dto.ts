import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @ApiProperty({ description: 'Blog post content' })
    @IsString({ message: 'Should be a string' })
    readonly content: string;
}
