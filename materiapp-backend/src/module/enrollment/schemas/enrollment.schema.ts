import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { EnrollmentState } from "../enums";

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'College', required: true })
    college: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Career', required: true })
    career: Types.ObjectId;

    @Prop({
        type: [{
            subject: { type: Types.ObjectId, ref: 'Subject', required: true },
            qualification: { type: Number, required: false, min: 0, max: 10 },
            date: { type: Date, required: false },
            state: { type: String, enum: EnrollmentState, required: true, default: EnrollmentState.STATELESS }
        }],
        required: true,
        default: []
    })
    subjects: [{
        subject: Types.ObjectId,
        qualification: number,
        date: Date,
        state: EnrollmentState
    }]
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);