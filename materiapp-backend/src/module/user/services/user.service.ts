import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../schemas';
import { plainToClass, plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDTO,
  ChangePasswordDto,
} from '../dtos';
import { SALT_ROUNDS } from 'src/core/config/environment';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    const newUser = new this.userModel({ ...rest, password: hashedPassword });
    const savedUser = await newUser.save();

    return plainToInstance(UserResponseDTO, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async updateProfile(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDTO> {
    const updatedUser = await this.userModel.findOneAndUpdate({ email }, { $set: updateUserDto }, { new: true }).lean();

    if (!updatedUser) { throw new NotFoundException('User not found') };

    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<UserResponseDTO> {
    const userFound = await this.userModel.findOne({ email }).exec();

    if (!userFound ) {
      throw new NotFoundException('User not found.');
    }

    if (!(await this.comparePassword(changePasswordDto.currentPassword, userFound.password))) {
      throw new BadRequestException('Current password is incorrect.');
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException('New password cannot be the same as the current one.');
    }

    userFound.password = await this.hashPassword(changePasswordDto.newPassword);

    await userFound.save();

    return plainToInstance(UserResponseDTO, userFound, {
      excludeExtraneousValues: true,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  //Gets
  async findUserByEmail(email: string): Promise<UserResponseDTO>{
    const userFound = await this.userModel.findOne({email: email}).lean();
    if(!userFound) { 
      throw new NotFoundException(`User with email ${email} not found`) 
    }
    return plainToInstance(UserResponseDTO,userFound, { excludeExtraneousValues: true, });
  }

  async getUsers(): Promise<UserResponseDTO[]>{
    const users = await this.userModel.find().lean();
    return plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true});
  }
  
  //Delete
  async deleteUserByEmail(email: string): Promise<UserResponseDTO>{
    await this.findUserByEmail(email);
    const userDelete = await this.userModel.findOneAndDelete({email: email}).lean();
    return plainToInstance(UserResponseDTO, userDelete, {excludeExtraneousValues: true});
  }
}
