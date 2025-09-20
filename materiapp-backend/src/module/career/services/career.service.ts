import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Career } from "../schemas";
import { CreateCareerDto, UpdateCareerDto, CareerResponseDTO } from "../dtos";
import { plainToInstance } from "class-transformer";
import th from "zod/v4/locales/th.js";

@Injectable()
export class CarreerService {

    constructor(@InjectModel(Career.name) private careerModel: Model<Career>) {

    }

    async createCareer(createCareerDTO: CreateCareerDto): Promise<CareerResponseDTO> {
        const newCareer = await new this.careerModel(createCareerDTO);
        await newCareer.save();
        return plainToInstance(CareerResponseDTO, newCareer, {
            excludeExtraneousValues: true,
        })
    }

    async updateCareer(id: string, updateCareerDto: UpdateCareerDto): Promise<Career> {
        const updateCareer = await this.careerModel.findByIdAndUpdate({ _id: id }, { $set: updateCareerDto }, { new: true }).exec();
        if (!updateCareer) throw new NotFoundException(`Canonot update career: No career found with id: ${id}`)
        return updateCareer;
    }

    async findCareerByID(id: string): Promise<Career> {
        const careerFound = await this.careerModel.findById(id).lean();
        if (!careerFound) throw new NotFoundException(`Career with id ${id} not found`)
        return careerFound;
    }

    async getCareers(): Promise<Career[]> {
        return this.careerModel.find().lean();
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