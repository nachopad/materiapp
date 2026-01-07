import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { subjectTypes } from "../utils";

export type CareerDocument = HydratedDocument<Career>;

@Schema({ timestamps: true })
export class Career {
    @Prop({
        type: String, required: true, validate: {
            validator: (value: string) => {
                return /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ\-]+$/.test(value);
            },
            message: (props) => `${props.value} Contains illegal characters.`,
        }
    })
    name: string;

    @Prop({ type: Types.ObjectId, ref: 'College', required: false })
    collegeId: Types.ObjectId;

    @Prop({
        type: [{
            subjectType: {
                type: String,
                enum: subjectTypes,
                require: true,
                default: subjectTypes.QUARTER
            },
            year: {
                type: Number,
                require: true,
                min: 1
            },
            quarter: {
                type: Number,
                require: false,
                default: null,
                min: 1,
                max: 2
            },
            subjectId: {
                type: Types.ObjectId,
                ref: 'Subject',
                require: true
            }
        }],
        default: [ ]
    })
    subjects: [{
        subjectType: string,
        year: number,
        quarter: number,
        subjectId: Types.ObjectId
    }]
}

export const CareerSchema = SchemaFactory.createForClass(Career);