import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Enrollment } from "../schemas";

@Injectable()
export class EnrollmentService {

    constructor(
        @InjectModel(Enrollment.name) private readonly enrollmentModel: Model<Enrollment>,
    ) { }

    async findAllByUser(userId: string): Promise<Enrollment[]> {
        return this.enrollmentModel.find({ user: userId }).lean();
    }

}