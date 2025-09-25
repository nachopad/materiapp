import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CollegeService } from "@/module/college/services";
import { SubjectService } from "@/module/subject/services";
import { plainToInstance } from "class-transformer";
import { CareerResponseDto, CreateCareerDto, UpdateCareerDto, CreateSubjectEmbeddedDto } from "../dtos";
import { Career } from "../schemas";

@Injectable()
export class CareerService {

    constructor(
        @InjectModel(Career.name) private careerModel: Model<Career>,
        @Inject(forwardRef(() => CollegeService)) private collegeService: CollegeService,
        private subjectService: SubjectService,
    ) { }

    /**
     * Solo crea, no agrega Subjects embebidos
     * @param createCareerDTO 
     * @returns 
     */
    async createCareer(createCareerDTO: CreateCareerDto): Promise<CareerResponseDto> {
        if (createCareerDTO.collegeId) await this.collegeService.getCollegeById(createCareerDTO.collegeId);
        const newCareer = await new this.careerModel(createCareerDTO);
        await newCareer.save();
        return plainToInstance(CareerResponseDto, newCareer, {
            excludeExtraneousValues: true,
        })
    }
    /**
     * Solo actualiza, no actualiza Subjects embebidos
     * @param id 
     * @param updateCareerDto 
     * @returns 
     */
    async updateCareer(id: string, updateCareerDto: UpdateCareerDto): Promise<Career> {
        if (updateCareerDto.collegeId) await this.collegeService.getCollegeById(updateCareerDto.collegeId);
        const updateCareer = await this.careerModel.findByIdAndUpdate({ _id: id }, { $set: updateCareerDto }, { new: true }).exec();
        if (!updateCareer) throw new NotFoundException(`Canonot update career: No career found with id: ${id}`)
        return updateCareer;
    }

    /**
     * Permite agregar una materia a una carrera
     * TODO --> Determinar en donde colocar este codigo para seguir con el patron SOLID
     * @param id 
     * @param subjectEmbedded 
     * @returns 
     */
    async addSubjectEmbedded(id: string, subjectEmbedded: CreateSubjectEmbeddedDto): Promise<Career | null> {
        await this.subjectService.findSubjectById(subjectEmbedded.subjectId.toString());
        const careerWithSubjects = await this.findCareerByID(id);
        const alreadyExists = careerWithSubjects.subjects.some(
            item => item.subjectId == subjectEmbedded.subjectId
        );
        if (alreadyExists) {
            console.log("No entra");
            
            throw new ConflictException(`A subject with id: ${subjectEmbedded.subjectId} already exists`);
        }
        careerWithSubjects.subjects.push(subjectEmbedded);
        return await this.careerModel.findByIdAndUpdate(id, careerWithSubjects, { new: true} );
    }

    async findCareerByID(id: string): Promise<Career> {
        const careerFound = await this.careerModel.findById(id).lean();
        if (!careerFound) throw new NotFoundException(`Career with id ${id} not found`)
        return careerFound;
    }

    async getCareers(): Promise<Career[]> {
        return this.careerModel.find().select('-subjects').lean();
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