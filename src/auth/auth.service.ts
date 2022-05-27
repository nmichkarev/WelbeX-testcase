import * as bcrypt from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async register(userDto: CreateUserDto) {
        const existing = await this.userService.findByLogin(userDto.login);
        if (existing) {
            throw new HttpException('Login already registered', HttpStatus.BAD_REQUEST);
        }
        const hash = await bcrypt.hash(userDto.password, 5);

        const user = await this.userService.create({
            ...userDto, 
            password: hash
        });

        return this.generateToken(user);
    }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }

        return this.generateToken(user);
    }

    async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.findByLogin(userDto.login);
        const passwordEquals = await bcrypt.compare(userDto.password, user.password);

        if (user && passwordEquals) {
            return user;
        }

        return null;
    }

    async generateToken(user: User) {
        const payload = { name: user.login, id: user.id };
        return this.jwtService.sign(payload);
    }
}
