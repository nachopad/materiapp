import { ApiStandardResponse, ApiVersionHeader } from "@/module/common/decorators";
import { IdValidationPipe } from "@/module/common/pipes";
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CareerResponseDto, CreateCareerDto, UpdateCareerDto } from "../dtos";
import { CreateSubjectEmbeddedDto } from "../dtos/create-subject-embedded.dto";
import { CollegeValidatePipe, SubjectValidatePipe } from "../pipes";
import { CareerService } from "../services";

@ApiVersionHeader('1')
@Controller({ path: 'career', version: '1' })
export class CareerController {

    constructor(private readonly careerService: CareerService) {
    }

    @Get()
    @ApiStandardResponse({
        summary: 'Get all Careers',
        description: 'Retrieves a list of all careers in the system',
        type: CareerResponseDto,
        isArray: true,
    })
    async getCareers(): Promise<CareerResponseDto[]> {
        const careers = await this.careerService.getCareers();
        return plainToInstance(CareerResponseDto, careers, {
            excludeExtraneousValues: true,
        });
    }


    @Get(':id')
    @ApiStandardResponse({
        summary: 'Get Career by Id',
        description: 'Retrieves a career by ID in the system',
        type: CareerResponseDto,
    })
    async getCareerById(@Param('id', new IdValidationPipe()) id: string): Promise<CareerResponseDto> {
        const careerFound = await this.careerService.findCareerByID(id);
        return plainToInstance(CareerResponseDto, careerFound, {
            excludeExtraneousValues: true,
        });
    }

    @Post()
    @ApiStandardResponse({
        summary: 'Create a new career',
        description: 'Creates a new user in the system',
        type: CareerResponseDto,
        status: 201,
    })
    async create(@Body(CollegeValidatePipe) createCareerDTO: CreateCareerDto): Promise<CareerResponseDto> {
        return await this.careerService.createCareer(createCareerDTO);
    }

    @Put(':id')
    @ApiStandardResponse({
        summary: 'Update career',
        description: 'Update career by id',
        type: CareerResponseDto,
    })
    async updateCareer(@Param('id', new IdValidationPipe()) id: string, @Body(CollegeValidatePipe, SubjectValidatePipe) updateCareerDTO: UpdateCareerDto): Promise<CareerResponseDto> {
        const updateCareer = await this.careerService.updateCareer(id, updateCareerDTO);
        return plainToInstance(CareerResponseDto, updateCareer, {
            excludeExtraneousValues: true,
        })
    }

    @Patch(':id')
    @ApiStandardResponse({
        summary: 'Add subject to career',
        description: 'Allow add subject embedded into career',
        type: CareerResponseDto
    })
    async addSubjectToCareer(@Param('id', new IdValidationPipe()) id: string, @Body() subjectEmbedded: CreateSubjectEmbeddedDto): Promise<CareerResponseDto> {
        const careerWithSubjectsEmbedded = await this.careerService.addSubjectEmbedded(id, subjectEmbedded);
        return plainToInstance(CareerResponseDto, careerWithSubjectsEmbedded, {
            excludeExtraneousValues: true
        })
    }


    @Delete(':id')
    @ApiStandardResponse({
        summary: 'Delete career',
        description: 'Delete career by id',
        type: CareerResponseDto,
    })
    async deleteCareer(@Param('id', new IdValidationPipe()) id: string): Promise<CareerResponseDto> {
        const careerDelete = await this.careerService.deleteCareerByID(id);
        return plainToInstance(CareerResponseDto, careerDelete, {
            excludeExtraneousValues: true,
        })
    }
}