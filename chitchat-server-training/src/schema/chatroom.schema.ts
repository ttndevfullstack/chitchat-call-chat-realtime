import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/common/enums/enums';

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

  @Prop({ type: Number, default: 0 })
  total_member: number;

  @Prop({ type: [String], ref: 'Message', default: [] })
  messages: string[];

  @Prop({ default: false, select: false })
  is_delete: boolean;

  @Prop({ type: String, default: 'offline' })
  status: UserStatus;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
