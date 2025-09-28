import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateEnrollmentDto } from "../dtos";
import { Enrollment } from "../schemas";

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async findAllByUser(userId: string): Promise<Enrollment[]> {
        return this.enrollmentModel.find({ user: new Types.ObjectId(userId) }).populate('college').populate('career').populate('subjects.subject').lean();
    }

    async create(
        userId: string,
        createEnrollmentDto: CreateEnrollmentDto
    ): Promise<Enrollment> {
        const newEnrollment = new this.enrollmentModel({
            ...createEnrollmentDto,
            user: new this.enrollmentModel.db.base.Types.ObjectId(userId),
        });
        return newEnrollment.save();
    }

}