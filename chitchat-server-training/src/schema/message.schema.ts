import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MessageType } from 'src/common/enums/enums';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ type: String, ref: 'User', required: true })
  sender: string;

  @Prop({ type: String, required: true })
  type: MessageType;

  @Prop({
    type: String,
    ref: 'Chatroom',
    required: true,
  })
  chatroom_id: mongoose.Schema.Types.ObjectId;

  @Prop({ default: false, select: false })
  is_delete: boolean;

  @Prop({ default: false, select: false })
  is_recall: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
