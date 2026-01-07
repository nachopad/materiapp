import { CareerService } from "@/module/career/services";
import { CollegeService } from "@/module/college/services";
import { SubjectService } from "@/module/subject/services";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateEnrollmentDto } from "../dtos";
import { SubjectDocument } from "@/module/subject/schemas";

@Injectable()
export class EnrollmentValidationPipe implements PipeTransform {

    constructor(
        private readonly careersService: CareerService,
        private readonly collegesService: CollegeService,
        private readonly subjectsService: SubjectService,
    ) { }

    async transform(value: any) {
        const enrollmentDto = plainToClass(CreateEnrollmentDto, value);
        const validationErrors = await validate(enrollmentDto);

        if (validationErrors.length > 0) throw new BadRequestException(`Validation failed: ${validationErrors}`);

        await this.validateDatabaseExistence(enrollmentDto);

        return enrollmentDto;
    }

    private async validateDatabaseExistence(enrollmentDto: CreateEnrollmentDto) {
        const errors: string[] = [];

        const careerExists = await this.careersService.findCareerByID(enrollmentDto.career);
        if (!careerExists) {
            errors.push(`Career with ID ${enrollmentDto.career} does not exist`);
        }

        const collegeExists = await this.collegesService.getCollegeById(enrollmentDto.college);
        if (!collegeExists) {
            errors.push(`College with ID ${enrollmentDto.college} does not exist`);
        }

        const subjectIds = enrollmentDto.subjects.map(subject => subject.subject);
        const subjects = await this.subjectsService.findSubjectsByIds(subjectIds);

        const nonExistentSubjects = subjectIds.filter(id => !subjects.find((subject: SubjectDocument) => subject._id.toString() === id));

        if (nonExistentSubjects.length > 0) {
            errors.push(`Subjects with IDs ${nonExistentSubjects.join(', ')} do not exist`);
        }

        // TODO: Validate subjects belong to the specified career

        if (errors.length > 0) {
            throw new BadRequestException(`Validation failed: ${errors.join(", ")}`);
        }
    }

}