import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EnrollmentController } from "./controllers";
import { Enrollment, EnrollmentSchema } from "./schemas";
import { EnrollmentService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }])
    ],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
    exports: [EnrollmentService],
})
export class EnrollmentModule { }