import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChannelStatus } from 'src/common/enums/enums';

export type ChannelDocument = HydratedDocument<Channel>;

@Schema({ timestamps: true })
export class Channel {
  @Prop({ type: String, required: true })
  room_id: string;

  @Prop({ type: [String], default: [] })
  participants: string[];

  @Prop({ type: Object, default: { resolution: '', frameRate: 0 } })
  videoCallSettings: {
    resolution: string;
    frameRate: number;
  };

  @Prop({ type: String, default: 'offline' })
  status: ChannelStatus;

  @Prop({ type: String })
  time_start: string;

  @Prop({ type: String })
  time_end: string;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
