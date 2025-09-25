import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Transform } from "class-transformer";

@Exclude()
export class SubjectEmbeddedResponseDto {

    @Expose()
    @ApiProperty()
    subjectType: string;

    @Expose()
    @ApiProperty()
    year: number;

    @Expose()
    @ApiProperty()
    quarter: number;

    @Expose()
    @ApiProperty()
    @Transform(({ obj }) => obj.subjectId?.toString())
    subjectId: string;
}