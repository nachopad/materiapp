import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CareerModule } from "../career/career.module";
import { CollegeController } from "./controllers";
import { College, CollegeSchema } from "./schemas";
import { CollegeService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }]),
        forwardRef(() => CareerModule)
    ],
    controllers: [CollegeController],
    providers: [CollegeService],
    exports: [CollegeService],
})
export class CollegeModule { }