import { SubjectService } from "@/module/subject/services";
import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";
import { UpdateCareerDto } from "../dtos";

@Injectable()
export class SubjectValidatePipe implements PipeTransform {
    
    constructor(private subjectService: SubjectService){

    }
    
    async transform(careerDto: UpdateCareerDto) {
        for (const subject of careerDto.subjects) {
            //Dentro del servicio lanza la excepción 
            await this.subjectService.findSubjectById(subject.subjectId.toString());
        }
        return careerDto;
    }

}