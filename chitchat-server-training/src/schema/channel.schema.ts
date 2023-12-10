import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: [String], required: true })
  room_id: string;

  @Prop({ type: [String], ref: 'User', required: true })
  members: string[];
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
