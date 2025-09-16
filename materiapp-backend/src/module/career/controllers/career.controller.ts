import { ApiStandardResponse, ApiVersionHeader } from "@/module/common/decorators";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CarreerService } from "../services";
import { CareerResponseDTO, CreateCareerDto, UpdateCareerDto } from "../dtos";
import { plainToInstance } from "class-transformer";
import { IdValidationPipe } from "../pipes/id-validation.pipe";

@ApiVersionHeader('1')
@Controller({ path: 'career', version: '1' })
export class CareerController {

    constructor(private readonly careerService: CarreerService) {
    }

    @Get()
    @ApiStandardResponse({
        summary: 'Get all Careers',
        description: 'Retrieves a list of all careers in the system',
        type: CareerResponseDTO,
        isArray: true,
    })
    async getCareers(): Promise<CareerResponseDTO[]> {
        const careers = await this.careerService.getCareers();
        return plainToInstance(CareerResponseDTO, careers, {
            excludeExtraneousValues: true,
        });
    }


    @Get(':id')
    @ApiStandardResponse({
        summary: 'Get Career by Id',
        description: 'Retrieves a career by ID in the system',
        type: CareerResponseDTO,
    })
    async getCareerById(@Param('id', new IdValidationPipe()) id: string): Promise<CareerResponseDTO> {
        const careerFound = await this.careerService.findCareerByID(id);
        return plainToInstance(CareerResponseDTO, careerFound, {
            excludeExtraneousValues: true,
        });
    }

    @Post()
    @ApiStandardResponse({
        summary: 'Create a new career',
        description: 'Creates a new user in the system',
        type: CareerResponseDTO,
        status: 201,
    })
    async create(@Body() createCareerDTO: CreateCareerDto): Promise<CareerResponseDTO> {
        return await this.careerService.createCareer(createCareerDTO);
    }

    @Put(':id')
    @ApiStandardResponse({
        summary: 'Update career',
        description: 'Update career by id',
        type: CareerResponseDTO,
    })
    async updateCareer(@Param('id') id: string, @Body() updateCareerDTO: UpdateCareerDto): Promise<CareerResponseDTO> {
        const updateCareer = await this.careerService.updateCareer(id, updateCareerDTO);
        return plainToInstance(CareerResponseDTO, updateCareer, {
            excludeExtraneousValues: true,
        })
    }

    @Delete(':id')
    @ApiStandardResponse({
        summary: 'Delete career',
        description: 'Delete career by id',
        type: CareerResponseDTO,
    })
    async deleteCareer(@Param('id', new IdValidationPipe()) id: string): Promise<CareerResponseDTO> {
        const careerDelete = await this.careerService.deleteCareerByID(id);
        return plainToInstance(CareerResponseDTO, careerDelete, {
            excludeExtraneousValues: true,
        })
    }
}