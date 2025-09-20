import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ\-]+$/.test(value);
      },
      message: (props) => `${props.value} contains invalid characters.`,
    },
  })
  name: string;
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);
