import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

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

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Subject' }], required: false })
    subjectsId: Types.ObjectId[];
}

export const CareerSchema = SchemaFactory.createForClass(Career);