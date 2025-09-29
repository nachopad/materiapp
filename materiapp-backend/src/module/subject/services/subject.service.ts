import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Subject } from '../schemas';
import {
  CreateSubjectDto,
  SubjectResponseDto,
  UpdateSubjectDto,
} from '../dtos';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubjectService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) { }

  async getSubjects(): Promise<Subject[]> {
    return this.subjectModel.find().lean();
  }

  async findSubjectById(id: string): Promise<Subject> {
    const subjectFound = await this.subjectModel.findById(id).lean();
    if (!subjectFound)
      throw new NotFoundException(`Subject with id ${id} not found.`);
    return subjectFound;
  }

  async createSubject(
    createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    const newSubject = new this.subjectModel(createSubjectDto);
    await newSubject.save();
    return plainToInstance(SubjectResponseDto, newSubject, {
      excludeExtraneousValues: true,
    });
  }

  async updateSubject(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const updatedSubject = await this.subjectModel
      .findByIdAndUpdate({ _id: id }, { $set: updateSubjectDto }, { new: true })
      .exec();

    if (!updatedSubject)
      throw new NotFoundException(
        `Canonot update subject: No subject found with id: ${id}.`,
      );

    return updatedSubject;
  }

  async deleteSubject(id: string): Promise<Subject | null> {
    return this.subjectModel.findByIdAndDelete(id).exec();
  }

  async findSubjectsByIds(ids: string[]): Promise<Subject[]> {
    return this.subjectModel.find({ _id: { $in: ids } }).lean();
  }
}
