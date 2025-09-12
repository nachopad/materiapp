import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

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

}

export const CareerSchema = SchemaFactory.createForClass(Career);