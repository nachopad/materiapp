import { Auth, User } from '@/module/auth/decorators';
import type { AuthUser } from '@/module/auth/interfaces';
import {
  ApiStandardResponse,
  ApiVersionHeader,
} from '@/module/common/decorators';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateEnrollmentDto, EnrollmentResponseDto } from '../dtos';
import { EnrollmentService } from '../services';
import { EnrollmentValidationPipe } from '../pipes';

@ApiVersionHeader('1')
@Controller('security')
@Controller({ path: 'enrollment', version: '1' })
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  @ApiStandardResponse({
    summary: 'Get all Enrollments of logged user',
    description:
      'Retrieves a list of all enrollments of the logged user in the system',
    type: EnrollmentResponseDto,
    isArray: true,
  })
  @Auth()
  async findAll(@User() user: AuthUser): Promise<EnrollmentResponseDto[]> {
    const enrollments = await this.enrollmentService.findAllByUser(user._id);
    return plainToInstance(EnrollmentResponseDto, enrollments, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @ApiStandardResponse({
    summary: 'Create a new Enrollment for logged user',
    description: 'Creates a new enrollment for the logged user in the system',
    type: EnrollmentResponseDto,
    status: 201,
  })
  @Auth()
  async create(
    @User() user: AuthUser,
    @Body(EnrollmentValidationPipe) createEnrollmentDto: CreateEnrollmentDto,
  ) {
    const enrollment = await this.enrollmentService.create(
      user._id,
      createEnrollmentDto,
    );
    return plainToInstance(EnrollmentResponseDto, enrollment, {
      excludeExtraneousValues: true,
    });
  }
}
