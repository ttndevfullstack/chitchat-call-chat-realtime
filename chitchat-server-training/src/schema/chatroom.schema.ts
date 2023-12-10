import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatroomDocument = HydratedDocument<Chatroom>;

@Schema({ timestamps: true })
export class Chatroom {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ type: String, ref: 'User', required: true })
  room_master: string;

  @Prop({ type: [String], ref: 'User', required: true })
  members: string[];

  @Prop({ type: [String], ref: 'Message', default: [] })
  messages: string[];

  @Prop({ default: false, select: false })
  is_delete: boolean;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
