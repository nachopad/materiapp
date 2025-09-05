import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../schemas';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UserResponseDTO } from '../dtos';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from 'src/core/config/environment';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new this.userModel({ ...rest, password: hashedPassword });
    const savedUser = await newUser.save();

    return plainToInstance(UserResponseDTO, savedUser, {
      excludeExtraneousValues: true,
    });
  }
}
