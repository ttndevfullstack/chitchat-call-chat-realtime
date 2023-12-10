import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const createdChannel = new this.channelModel(createChannelDto);
    await createdChannel.save();

    if (!createdChannel)
      throw new BadRequestException('Create channel failure');

    return {
      status: 201,
      success: true,
      data: createdChannel,
    };
  }

  public async joinRoom(createChannelDto: CreateChannelDto) {
    const channel = await this.channelModel.findOne({
      room_id: createChannelDto.room_id,
    });

    if (!channel) {
      const res = await this.create(createChannelDto);
      return {
        status: 201,
        success: true,
        data: res.data,
      };
    }

    const updateChannel = await this.channelModel.findOneAndUpdate(
      { room_id: createChannelDto.room_id },
      { members: [...channel.members, createChannelDto.member] },
    );

    return {
      status: 201,
      success: true,
      data: updateChannel,
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
