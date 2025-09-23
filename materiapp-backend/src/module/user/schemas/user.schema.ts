import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, unique: true })
    email: string;

    @Prop({ type: String })
    password: string;

    @Prop({ type: String })
    googleId: string;

    @Prop({type: Boolean, default: false})
    validateAccount: boolean; //Lo agregue para indicar si el usuario ingreso un email que exista - Sirve para luego poder limipiar la BD
}

export const UserSchema = SchemaFactory.createForClass(User);