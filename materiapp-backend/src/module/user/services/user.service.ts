import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../schemas';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDTO,
  ChangePasswordDto,
} from '../dtos';
import { SALT_ROUNDS } from 'src/core/config/environment';
import { GoogleProfile } from 'src/module/auth/interfaces';

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
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, { $set: updateUserDto }, { new: true })
      .lean();

    if (!updatedUser) {
      throw new NotFoundException(
        `Cannot update profile: No user found with email "${email}".`,
      );
    }

    return updatedUser;
  }

  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<User> {
    const userFound = await this.userModel.findOne({ email }).exec();

    if (!userFound) {
      throw new NotFoundException(
        `Cannot change password: No user found with email "${email}".`,
      );
    }

    if (
      !(await this.comparePassword(
        changePasswordDto.currentPassword,
        userFound.password,
      ))
    ) {
      throw new BadRequestException(
        'The current password you provided is incorrect.',
      );
    }

    if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        'The new password cannot be the same as the current password.',
      );
    }

    userFound.password = await this.hashPassword(changePasswordDto.newPassword);

    await userFound.save();

    return userFound;
  }

  async findUserByEmail(email: string): Promise<User> {
    const userFound = await this.userModel.findOne({ email: email }).exec();
    if (!userFound) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return userFound;
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().lean();
  }

  async deleteUserByEmail(email: string): Promise<User | null> {
    await this.findUserByEmail(email);
    return await this.userModel.findOneAndDelete({ email: email }).lean();
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async createOrFindGoogleUser(user: GoogleProfile): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ email: user.emails[0].value })
      .exec();
    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.googleId = user.id;
        await existingUser.save();
      }
      return existingUser;
    } else {
      const createdUser = new this.userModel({
        email: user.emails[0].value,
        name: user.displayName,
        googleId: user.id,
      });
      return createdUser.save();
    }
  }
}
