import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';


@Injectable()
export class IdValidationPipe implements PipeTransform {
  transform(id: any) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id format');
    }
    return id;
  }
}
