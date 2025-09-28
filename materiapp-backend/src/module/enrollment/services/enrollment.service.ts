import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Enrollment } from "../schemas";
import { CreateEnrollmentDto } from "../dtos";

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async findAllByUser(userId: string): Promise<Enrollment[]> {
        return this.enrollmentModel.find({ user: userId }).lean();
    }

    async create(
        userId: string,
        createEnrollmentDto: CreateEnrollmentDto
    ): Promise<Enrollment> {
        const newEnrollment = new this.enrollmentModel({
            ...createEnrollmentDto,
            user: new this.enrollmentModel.db.base.Types.ObjectId(userId),
        });
        return newEnrollment;
    }

}