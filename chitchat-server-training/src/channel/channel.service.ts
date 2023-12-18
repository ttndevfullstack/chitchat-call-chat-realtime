import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChannelDto } from './dto/create-channel.dto';
import { Channel } from 'src/schema/channel.schema';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(Channel.name) private channelModel: Model<Channel>,
  ) {}

  public async findOneById(id: string) {
    const chatroom = await this.channelModel.findOne({ room_id: id });
    if (!chatroom) throw new NotFoundException('Chan not found');

    return {
      status: 201,
      success: true,
      data: chatroom,
    };
  }

  public async create(createChannelDto: CreateChannelDto) {
    let channel;
    channel = await this.channelModel.findOne({
      room_id: createChannelDto.room_id,
    });

    if (!channel) {
      const created_channel = new this.channelModel(createChannelDto);
      await created_channel.save();
      channel = created_channel;
    }

    return {
      status: 201,
      success: true,
      data: channel,
    };
  }

  public async joinToChannel(id: string, email: string) {
    const channel = await this.channelModel.findOne({ room_id: id });
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.participants) {
      if (channel.participants.includes(email)) {
        return {
          status: 201,
          success: true,
          data: channel,
        };
      }
    }

    const updated_channel = await this.channelModel.findOneAndUpdate(
      { room_id: id },
      { participants: [...channel.participants, email] },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updated_channel,
    };
  }

  public async leftChannel(id: string, email: string) {
    const channel = await this.channelModel.findOne({ room_id: id });
    if (!channel) throw new NotFoundException('Channel not found');

    const updated_participates = channel.participants.filter(
      (participant) => !participant.includes(email),
    );

    const updatedChannel = await this.channelModel.findOneAndUpdate(
      { room_id: id },
      { participants: updated_participates },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updatedChannel,
    };
  }

  public async delete(id: string) {
    const deletedChanel = await this.channelModel.findOneAndDelete({ _id: id });
    if (!deletedChanel) throw new NotFoundException('Chat room not found');

    return {
      status: 201,
      success: true,
      data: deletedChanel,
    };
  }
}
