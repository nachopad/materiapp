import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Career } from "../schemas";
import { CreateCareerDto, UpdateCareerDto, CareerResponseDTO } from "../dtos";
import { plainToInstance } from "class-transformer";

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
        const updateCareer = await this.careerModel.findByIdAndUpdate({ _id: id }, { $set: updateCareerDto }).exec();
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
}