import { JwtAccessAuthGuard } from "@/module/auth/guards";
import { ApiStandardResponse, ApiVersionHeader } from "@/module/common/decorators";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CollegeResponseDTO, CreateCollegeDto, UpdateCollegeDto } from "../dtos";
import { CollegeService } from "../services";

@ApiVersionHeader('1')
@Controller({ path: 'college', version: '1' })
export class CollegeController {

    constructor(private readonly collegeService: CollegeService) { }

    @Post()
    @ApiStandardResponse({
        summary: 'Create a new college',
        description: 'Creates a new college in the system',
        type: CollegeResponseDTO,
        status: 201,
    })
    @UseGuards(JwtAccessAuthGuard)
    async create(
        @Body() createCollegeDto: CreateCollegeDto
    ): Promise<CollegeResponseDTO> {
        const college = await this.collegeService.create(createCollegeDto);
        return plainToInstance(CollegeResponseDTO, college, {
            excludeExtraneousValues: true,
        });
    }

    @Put(':id')
    @ApiStandardResponse({
        summary: 'Update college information',
        description: 'Updates the information of an existing college identified by ID',
        type: CollegeResponseDTO,
    })
    @UseGuards(JwtAccessAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateCollegeDto: UpdateCollegeDto
    ): Promise<CollegeResponseDTO> {
        const college = await this.collegeService.update(id, updateCollegeDto);
        return plainToInstance(CollegeResponseDTO, college, {
            excludeExtraneousValues: true,
        });
    }

    @Get()
    @ApiStandardResponse({
        summary: 'Get all colleges',
        description: 'Retrieves a list of all colleges in the system',
        type: CollegeResponseDTO,
        isArray: true,
    })
    async getColleges(): Promise<CollegeResponseDTO[]> {
        const colleges = await this.collegeService.getColleges();
        return plainToInstance(CollegeResponseDTO, colleges, {
            excludeExtraneousValues: true,
        });
    }

    @Get(':id')
    @ApiStandardResponse({
        summary: 'Get college by ID',
        description: 'Retrieves a college by its ID',
        type: CollegeResponseDTO,
    })
    async getCollegeById(@Param('id') id: string): Promise<CollegeResponseDTO> {
        const college = await this.collegeService.getCollegeById(id);
        return plainToInstance(CollegeResponseDTO, college, {
            excludeExtraneousValues: true,
        });
    }

    @Delete(':id')
    @ApiStandardResponse({
        summary: 'Delete college by ID',
        description: 'Deletes a college identified by its ID',
        type: CollegeResponseDTO,
    })
    @UseGuards(JwtAccessAuthGuard)
    async deleteCollegeById(@Param('id') id: string): Promise<CollegeResponseDTO> {
        const college = await this.collegeService.deleteCollegeById(id);
        return plainToInstance(CollegeResponseDTO, college, {
            excludeExtraneousValues: true,
        });
    }
}