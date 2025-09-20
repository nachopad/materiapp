import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CollegeController } from "./controllers";
import { College, CollegeSchema } from "./schemas";
import { CollegeService } from "./services";
import { CareerModule } from "../career/career.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }]),
        CareerModule
    ],
    controllers: [CollegeController],
    providers: [CollegeService],
    exports: [CollegeService],
})
export class CollegeModule { }