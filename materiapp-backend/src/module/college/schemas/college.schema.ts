import { xssSafeString, xssSafeStringMessage } from "@/shared/utils";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

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

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Career' }], required: false })
    careers: Types.ObjectId[];
}

export const CollegeSchema = SchemaFactory.createForClass(College);