import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Career, CareerSchema } from "./schemas/career.schema";
import { CareerController } from "./controllers";
import { CarreerService } from "./services";
import { CollegeModule } from "../college/college.module";
import { SubjectModule } from "../subject/subject.module";

@Module({
    imports:[
        MongooseModule.forFeature([ { name: Career.name, schema: CareerSchema } ]),
        CollegeModule,
        SubjectModule
    ],
    controllers: [CareerController],
    providers:[CarreerService],
    exports: [CarreerService],
})
export class CareerModule{}