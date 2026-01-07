import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { JWT_ACCESS_SECRET, SALT_ROUNDS } from '@/core/config/environment';
import { GoogleProfile, JwtPayload } from '@/module/auth/interfaces';
import { plainToInstance } from 'class-transformer';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDTO,
} from '../dtos';
import { User } from '../schemas';
import { mailService } from '@/module/mail/services/mail.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: mailService,
    private readonly jwtService: JwtService) { }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDTO> {
    const { password, ...rest } = createUserDto;

    const hashedPassword = await this.hashPassword(password);

    const newUser = new this.userModel({ ...rest, password: hashedPassword });
    const savedUser = await newUser.save();

    const contextEmail = await this.generateTokenEmailActivate(createUserDto.email, savedUser._id.toString(), createUserDto.name);
    await this.mailService.sendVerificationEmail(savedUser.email, contextEmail);

    return plainToInstance(UserResponseDTO, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async generateTokenEmailActivate(email: string, id: string, name: string) {
    const tokenForValidate = await this.jwtService.sign({ email: email, sub: id }, { secret: JWT_ACCESS_SECRET, expiresIn: '2m' });
    return {
      username: name,
      verificationLink: `api/v1/auth/validateAccount/${email}?token=${tokenForValidate}`
    }
  }

  async activeAccount(email: string, tokenForValidate: string): Promise<User> {
    try {
      const payload: JwtPayload = this.jwtService.verify(tokenForValidate, {
        secret: JWT_ACCESS_SECRET,
      });
      await this.userModel.findOneAndUpdate({ email: email }, { validateAccount: true }, { new: true });
      return await this.findUserByEmail(email);
    } catch (error) {
      if (error.name == "TokenExpiredError") throw new UnauthorizedException('The token has expired. Please try again later.');
      throw new UnauthorizedException('Token inválido.');
    }

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
        validateAccount: true
      });
      await this.mailService.sendWelcome(user.emails[0].value, user.displayName)
      return createdUser.save();
    }
  }
}
