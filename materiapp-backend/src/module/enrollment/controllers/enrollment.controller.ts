import { Auth } from "@/module/auth/decorators";
import { ApiStandardResponse, ApiVersionHeader } from "@/module/common/decorators";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CreateEnrollmentDto, EnrollmentResponseDto } from "../dtos";
import { EnrollmentService } from "../services";

@ApiVersionHeader('1')
@Controller({ path: 'enrollment', version: '1' })
export class EnrollmentController {

    constructor(private readonly enrollmentService: EnrollmentService) { }

    @Get()
    @ApiStandardResponse({
        summary: 'Get all Enrollments of logged user',
        description: 'Retrieves a list of all enrollments of the logged user in the system',
        type: EnrollmentResponseDto,
        isArray: true,
    })
    @Auth()
    async findAll(): Promise<EnrollmentResponseDto[]> {
        const enrollments = await this.enrollmentService.findAllByUser('userId');
        return plainToInstance(EnrollmentResponseDto, enrollments, {
            excludeExtraneousValues: true,
        })
    }

    @Post()
    @ApiStandardResponse({
        summary: 'Create a new Enrollment',
        description: 'Creates a new enrollment for the logged user in the system',
        type: EnrollmentResponseDto,
        status: 201
    })
    @Auth()
    async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
        return "Not implemented yet";
        // const enrollment = await this.enrollmentService.create(createEnrollmentDto);
        // return plainToInstance(EnrollmentResponseDto, enrollment, {
        //     excludeExtraneousValues: true,
        // });
    }

}