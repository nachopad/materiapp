import { xssSafeString, xssSafeStringMessage } from "@/shared/utils";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type CollegeDocument = HydratedDocument<College>;

@Schema({ timestamps: true })
export class College {
    @Prop({
        type: String,
        required: true,
        validate: {
            validator: xssSafeString,
            message: xssSafeStringMessage,
        }
    })
    name: string;
}

export const CollegeSchema = SchemaFactory.createForClass(College);