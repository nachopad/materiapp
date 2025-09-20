import { CareerService } from "@/module/career/services";
import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCollegeDto, UpdateCollegeDto } from "../dtos";
import { College } from "../schemas";

@Injectable()
export class CollegeService {
    constructor(
        @InjectModel(College.name) private collegeModel: Model<College>,
        @Inject(forwardRef(() => CareerService)) private careerService: CareerService,
    ) { }

    async create(createCollegeDto: CreateCollegeDto): Promise<College> {
        if (createCollegeDto.careers) {
            createCollegeDto.careers = await this.careerService.validateCareerIds(createCollegeDto.careers);
        }

        const newCollege = new this.collegeModel(createCollegeDto);
        return await newCollege.save();
    }

    async update(id: string, updateCollegeDto: UpdateCollegeDto): Promise<College> {
        if (updateCollegeDto.careers) {
            updateCollegeDto.careers = await this.careerService.validateCareerIds(updateCollegeDto.careers);
        }

        const updatedCollege = await this.collegeModel.findByIdAndUpdate(id, updateCollegeDto, { new: true }).lean();
        if (!updatedCollege) throw new NotFoundException(`Cannot update college: No college found with id: ${id}`);
        return updatedCollege;
    }

    async getColleges(): Promise<College[]> {
        return this.collegeModel.find().lean();
    }

    async getCollegeById(id: string): Promise<College> {
        const collegeFound = await this.collegeModel.findById(id).lean();
        if (!collegeFound) throw new NotFoundException(`No college found with id: ${id}`);
        return collegeFound;
    }

    async deleteCollegeById(id: string): Promise<College> {
        const deletedCollege = await this.collegeModel.findByIdAndDelete(id).lean();
        if (!deletedCollege) throw new NotFoundException(`Cannot delete college: No college found with id: ${id}`);
        return deletedCollege;
    }
}