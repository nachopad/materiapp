import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CareerModule } from "../career/career.module";
import { CollegeModule } from "../college/college.module";
import { SubjectModule } from "../subject/subject.module";
import { EnrollmentController } from "./controllers";
import { Enrollment, EnrollmentSchema } from "./schemas";
import { EnrollmentService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
        CareerModule,
        CollegeModule,
        SubjectModule
    ],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
    exports: [EnrollmentService],
})
export class EnrollmentModule { }