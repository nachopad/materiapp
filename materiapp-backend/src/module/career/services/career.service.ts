import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CollegeService } from "@/module/college/services";
import { SubjectService } from "@/module/subject/services";
import { plainToInstance } from "class-transformer";
import { CareerResponseDTO, CreateCareerDto, UpdateCareerDto } from "../dtos";
import { Career } from "../schemas";

@Injectable()
export class CarreerService {

    constructor(@InjectModel(Career.name) private careerModel: Model<Career>,
        private collegeService: CollegeService,
        private subjectService: SubjectService) { }

    async createCareer(createCareerDTO: CreateCareerDto): Promise<CareerResponseDTO> {
        if (createCareerDTO.collegeId) await this.collegeService.getCollegeById(createCareerDTO.collegeId);

        createCareerDTO.subjectsId = await this.validateSubjectsExist(createCareerDTO.subjectsId);

        const newCareer = await new this.careerModel(createCareerDTO);
        await newCareer.save();
        return plainToInstance(CareerResponseDTO, newCareer, {
            excludeExtraneousValues: true,
        })
    }

    async updateCareer(id: string, updateCareerDto: UpdateCareerDto): Promise<Career> {
        if (updateCareerDto.collegeId) await this.collegeService.getCollegeById(updateCareerDto.collegeId);
        if (updateCareerDto.subjectsId) {
            updateCareerDto.subjectsId = await this.validateSubjectsExist(updateCareerDto.subjectsId);
        }
        const updateCareer = await this.careerModel.findByIdAndUpdate({ _id: id }, { $set: updateCareerDto }, { new: true }).exec();
        if (!updateCareer) throw new NotFoundException(`Canonot update career: No career found with id: ${id}`)
        return updateCareer;
    }

    /**
     * This method validates the existence of the IDs in the database and removes duplicate values.
     * @param listId 
     * @returns list without duplicate values
     */
    async validateSubjectsExist(listId: string[]): Promise<string[]> {
        if (Array.isArray(listId) && listId.length > 0) {
            listId = [...new Set(listId)];
            for (const id of listId) {
                await this.subjectService.findSubjectById(id);
            }
            return listId;
        }
        return [];
    }

    async findCareerByID(id: string): Promise<Career> {
        const careerFound = await this.careerModel.findById(id).populate(['collegeId', 'subjectsId'], 'name').lean();
        if (!careerFound) throw new NotFoundException(`Career with id ${id} not found`)
        return careerFound;
    }

    async getCareers(): Promise<Career[]> {
        return this.careerModel.find().populate(['collegeId', 'subjectsId'], 'name').lean();
    }

    async deleteCareerByID(id: string): Promise<Career | null> {
        await this.findCareerByID(id);
        return await this.careerModel.findByIdAndDelete(id).lean();
    }

    async validateCareerIds(ids: string[]): Promise<string[]> {
        if (!ids.length) return [];

        const careersIds = Array.from(new Set(ids));

        const foundCareers = await this.careerModel.find({ _id: { $in: careersIds } }).lean();
        if (foundCareers.length !== careersIds.length) {
            const foundIds = foundCareers.map(c => c._id.toString());
            const missing = careersIds.filter(id => !foundIds.includes(id));
            throw new BadRequestException(`Career IDs do not exist: ${missing.join(', ')}`);
        }

        return careersIds;
    }
}