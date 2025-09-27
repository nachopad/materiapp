import { Auth } from "@/module/auth/decorators";
import { ROLE_ADMIN } from "@/module/common/constants";
import { ApiStandardResponse, ApiVersionHeader } from "@/module/common/decorators";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { CollegeResponseDto, CreateCollegeDto, UpdateCollegeDto } from "../dtos";
import { CollegeService } from "../services";

@ApiVersionHeader('1')
@Controller({ path: 'college', version: '1' })
export class CollegeController {

    constructor(private readonly collegeService: CollegeService) { }

    @Post()
    @ApiStandardResponse({
        summary: 'Create a new college',
        description: 'Creates a new college in the system',
        type: CollegeResponseDto,
        status: 201,
    })
    @Auth(ROLE_ADMIN)
    async create(
        @Body() createCollegeDto: CreateCollegeDto
    ): Promise<CollegeResponseDto> {
        const college = await this.collegeService.create(createCollegeDto);
        return plainToInstance(CollegeResponseDto, college, {
            excludeExtraneousValues: true,
        });
    }

    @Put(':id')
    @ApiStandardResponse({
        summary: 'Update college information',
        description: 'Updates the information of an existing college identified by ID',
        type: CollegeResponseDto,
    })
    @Auth(ROLE_ADMIN)
    async update(
        @Param('id') id: string,
        @Body() updateCollegeDto: UpdateCollegeDto
    ): Promise<CollegeResponseDto> {
        const college = await this.collegeService.update(id, updateCollegeDto);
        return plainToInstance(CollegeResponseDto, college, {
            excludeExtraneousValues: true,
        });
    }

    @Get()
    @ApiStandardResponse({
        summary: 'Get all colleges',
        description: 'Retrieves a list of all colleges in the system',
        type: CollegeResponseDto,
        isArray: true,
    })
    async getColleges(): Promise<CollegeResponseDto[]> {
        const colleges = await this.collegeService.getColleges();
        return plainToInstance(CollegeResponseDto, colleges, {
            excludeExtraneousValues: true,
        });
    }

    @Get(':id')
    @ApiStandardResponse({
        summary: 'Get college by ID',
        description: 'Retrieves a college by its ID',
        type: CollegeResponseDto,
    })
    async getCollegeById(@Param('id') id: string): Promise<CollegeResponseDto> {
        const college = await this.collegeService.getCollegeById(id);
        return plainToInstance(CollegeResponseDto, college, {
            excludeExtraneousValues: true,
        });
    }

    @Delete(':id')
    @ApiStandardResponse({
        summary: 'Delete college by ID',
        description: 'Deletes a college identified by its ID',
        type: CollegeResponseDto,
    })
    @Auth(ROLE_ADMIN)
    async deleteCollegeById(@Param('id') id: string): Promise<CollegeResponseDto> {
        const college = await this.collegeService.deleteCollegeById(id);
        return plainToInstance(CollegeResponseDto, college, {
            excludeExtraneousValues: true,
        });
    }
}