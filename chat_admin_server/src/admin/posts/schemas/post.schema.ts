import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({ type: String })
    content?: string;

    @Prop({ type: [String], default: [] })
    media?: string[];

    @Prop({ default: false })
    hidden?: boolean; // hidden by admin

    @Prop({ default: false })
    isDeleted?: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
