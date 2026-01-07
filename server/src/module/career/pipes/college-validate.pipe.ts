import { CollegeService } from "@/module/college/services";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

@Injectable()
export class CollegeValidatePipe implements PipeTransform {
    
    constructor(private collegeService: CollegeService){

    }
    
    async transform(careerDto: any) {
        if(!isValidObjectId(careerDto.collegeId)){
            throw new BadRequestException('Invalid id format');
        }
        /**Dentro del siguiente servicio lanza una excepcion  */
        await this.collegeService.getCollegeById(careerDto.collegeId);
        return careerDto;
    }

}