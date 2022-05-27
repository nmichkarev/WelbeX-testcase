import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
  
    @ApiResponse({ status: 201, type: String, description: 'Access token' })
    @Post('register')
    async register(@Body() userDto: CreateUserDto) {
        return this.authService.register(userDto);
    }

    @ApiResponse({ status: 201, type: String, description: 'Access token' })
    @Post('login')
    async login(@Body() userDto: CreateUserDto) {
        return this.authService.login(userDto);
    }
}
