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
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '../dtos';
import { SALT_ROUNDS } from 'src/core/config/environment';
import { ChangePasswordDto } from '../dtos/change-password.dto';

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

  async updateProfile(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDTO> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, { $set: updateUserDto }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDTO, updatedUser, {
      excludeExtraneousValues: true,
    });
  }

  async changePassword(
    email: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check that the current password matches
    const isMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check that the new password is not the same as the current one
    const isSame = await bcrypt.compare(
      changePasswordDto.newPassword,
      user.password,
    );
    if (isSame) {
      throw new BadRequestException(
        'New password cannot be the same as the current password',
      );
    }

    // Save the new password
    user.password = await bcrypt.hash(
      changePasswordDto.newPassword,
      SALT_ROUNDS,
    );
    await user.save();

    return { message: 'Password updated successfully' };
  }
}
