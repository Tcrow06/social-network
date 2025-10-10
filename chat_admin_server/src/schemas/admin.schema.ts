import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name?: string;

    @Prop()
    refreshTokenHash?: string;

    @Prop()
    otpHash?: string;

    @Prop()
    otpExpiresAt?: Date;

    @Prop({ default: false })
    isRoot?: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.index({ email: 1 });
