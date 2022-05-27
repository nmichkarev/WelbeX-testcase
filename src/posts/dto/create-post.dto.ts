import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ description: 'Blog post content' })
    @IsString({ message: 'Should be a string' })
    readonly content: string;
}
