import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CollegeController } from "./controllers";
import { College, CollegeSchema } from "./schemas";
import { CollegeService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: College.name, schema: CollegeSchema }]),
    ],
    controllers: [CollegeController],
    providers: [CollegeService],
    exports: [CollegeService],
})
export class CollegeModule { }