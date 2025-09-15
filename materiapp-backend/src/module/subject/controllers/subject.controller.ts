import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiStandardResponse,
  ApiVersionHeader,
} from '@/module/common/decorators';

import { SubjectService } from '../services';
import {
  CreateSubjectDto,
  SubjectResponseDto,
  UpdateSubjectDto,
} from '../dtos';
import { plainToInstance } from 'class-transformer';
import { IdValidationPipe } from '../pipes';

@ApiVersionHeader('1')
@Controller({ path: 'subject', version: '1' })
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @ApiStandardResponse({
    summary: 'Get all subjects.',
    description: 'Retrieves a list of all subjects in the system.',
    type: SubjectResponseDto,
    isArray: true,
  })
  async getSubjects(): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectService.getSubjects();
    return plainToInstance(SubjectResponseDto, subjects, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiStandardResponse({
    summary: 'Get subject by ID.',
    description: 'Retrieves a subject by its unique identifier.',
    type: SubjectResponseDto,
    isArray: false,
  })
  async getSubjectById(
    @Param('id', new IdValidationPipe()) id: string,
  ): Promise<SubjectResponseDto> {
    const subject = await this.subjectService.findSubjectById(id);
    return plainToInstance(SubjectResponseDto, subject, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @ApiStandardResponse({
    summary: 'Create a subject.',
    description: 'Creates and stores a new subject in the system.',
    type: SubjectResponseDto,
    isArray: false,
    status: 201,
  })
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return await this.subjectService.createSubject(createSubjectDto);
  }

  @Put(':id')
  @ApiStandardResponse({
    summary: 'Update a subject.',
    description: 'Updates an existing subject by ID.',
    type: SubjectResponseDto,
    status: 200,
  })
  async updateSubject(
    @Param('id', new IdValidationPipe()) id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const updatedSubject = await this.subjectService.updateSubject(
      id,
      updateSubjectDto,
    );
    return plainToInstance(SubjectResponseDto, updatedSubject, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiStandardResponse({
    summary: 'Delete a subject.',
    description: 'Deletes a subject by ID.',
    type: SubjectResponseDto,
    status: 200,
  })
  async deleteSubject(
    @Param('id', new IdValidationPipe()) id: string,
  ): Promise<SubjectResponseDto> {
    const deletedSubject = await this.subjectService.deleteSubject(id);
    return plainToInstance(SubjectResponseDto, deletedSubject, {
      excludeExtraneousValues: true,
    });
  }
}
