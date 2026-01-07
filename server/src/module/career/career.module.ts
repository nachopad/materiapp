import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Career, CareerSchema } from "./schemas/career.schema";
import { CareerController } from "./controllers";
import { CareerService } from "./services";
import { CollegeModule } from "../college/college.module";
import { SubjectModule } from "../subject/subject.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Career.name, schema: CareerSchema }]),
        forwardRef(() => CollegeModule),
        SubjectModule
    ],
    controllers: [CareerController],
    providers: [CareerService],
    exports: [CareerService],
})
export class CareerModule { }