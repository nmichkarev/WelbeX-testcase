import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'User login' })
    @IsString({ message: 'Should be a string' })
    readonly login: string;
    
    @ApiProperty({ example: '1ddf{8*9g', description: 'Password' })
    @IsString({ message: 'Should be a string' })
    @Length(4, 16, { message: 'Not less than 4 and no more than 16'})
    readonly password: string;
}