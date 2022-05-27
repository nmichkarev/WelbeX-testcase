import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
    
    constructor(@InjectModel(User) private userRepository: typeof User) {}

    async findByLogin(login: string) {
        return this.userRepository.findOne({ where: { login } });
    }

    async create(userDto: CreateUserDto) {
        return this.userRepository.create(userDto);
    }
}
