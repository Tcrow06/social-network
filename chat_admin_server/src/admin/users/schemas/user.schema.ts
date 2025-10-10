import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email: string;

    @Prop()
    username?: string;

    @Prop()
    phone?: string;

    @Prop()
    displayName?: string;

    @Prop()
    avatarUrl?: string;

    @Prop({ default: '' })
    bio?: string;

    @Prop({ type: [String], default: ['user'] })
    roles?: string[];

    @Prop({ default: true })
    isActive?: boolean;

    @Prop({ default: false })
    isDeleted?: boolean;

    // optional reference to external id
    @Prop({ type: Types.ObjectId })
    externalId?: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
