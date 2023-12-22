import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from 'src/schema/chatroom.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { GetChatRoomParams } from './dto/get-chatroom-params';
import { ChatroomType } from 'src/common/enums/enums';
import { UpdateChannelDto } from './../channel/dto/update-channel.dto';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<Chatroom>,
    private readonly userService: UserService,
  ) {}

  public async findOneById(id: string) {
    const chatroom = await this.chatroomModel.findOne({ _id: id });
    if (!chatroom) throw new NotFoundException('Chat room not found');

    return {
      status: 201,
      success: true,
      data: chatroom,
    };
  }

  public async findAllByEmail(params: GetChatRoomParams) {
    let chatrooms;

    if (params.type === ChatroomType.DIRECT) {
      chatrooms = await this.chatroomModel
        .find({
          $and: [
            {
              $or: [
                { roomMaster: params.email },
                { members: { $in: [params.email] } },
              ],
            },
            { type: ChatroomType.DIRECT },
          ],
        })
        .sort({ createdAt: -1 });
    } else {
      chatrooms = await this.chatroomModel
        .find({
          $and: [
            {
              $or: [
                { roomMaster: params.email },
                { members: { $in: [params.email] } },
              ],
            },
            { type: ChatroomType.GROUP },
          ],
        })
        .sort({ createdAt: -1 });
    }

    return {
      status: 201,
      success: true,
      data: chatrooms,
    };
  }

  public async findAllMember(chatroom_id: string) {
    const chatroom = await this.chatroomModel.findOne({ _id: chatroom_id });
    if (!chatroom) throw new NotFoundException('Chat room not found');

    const response = await this.userService.findAllUserInRoom(chatroom.members);
    const members = response.data;

    return {
      status: 201,
      success: true,
      data: members,
    };
  }

  public async create(createChatroomDto: CreateChatroomDto) {
    let chatroom;

    console.log(createChatroomDto);

    if (createChatroomDto.type == ChatroomType.DIRECT) {
      chatroom = await this.chatroomModel.findOne({
        $and: [
          { members: { $in: createChatroomDto.members[0] } },
          { members: { $in: createChatroomDto.members[1] } },
          { type: createChatroomDto.type },
        ],
      });

      if (!chatroom) {
        chatroom = await this.chatroomModel.create({
          ...createChatroomDto,
          type: ChatroomType.DIRECT,
        });
      }
    }

    if (createChatroomDto.type == ChatroomType.GROUP) {
      let group_name;
      createChatroomDto.members.forEach((member) => {
        group_name += ', ' + member;
      });

      chatroom = await this.chatroomModel.create({
        ...createChatroomDto,
        name: createChatroomDto.name || group_name,
        type: ChatroomType.GROUP,
      });
    }

    // const response = await this.userService.findAllUserInRoom(chatroom.members);
    // const member_details = response.data;

    return {
      status: 201,
      success: true,
      data: chatroom,
    };
  }

  public async updateStatus(email: string, status: string) {
    const group_chatroom = await this.chatroomModel.updateMany(
      { members: { $in: [email] }, total_member: { $gt: 2 } },
      { $set: { status: status } },
    );
    if (!group_chatroom)
      throw new NotFoundException('Chat room not found or not updated');

    return {
      status: 201,
      success: true,
      data: group_chatroom,
    };
  }

  public async joinChatRoom(chatroomId: string, email: string) {
    const chatroom = await this.chatroomModel.findOne({ _id: chatroomId });
    if (!chatroom) throw new NotFoundException('Chat room not found');

    await this.userService.findByEmail(email);

    const updatedChatroom = await this.chatroomModel.findByIdAndUpdate(
      chatroom._id,
      {
        members: { ...chatroom.members, email },
      },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updatedChatroom,
    };
  }

  public async leaveChatRoom(chatroomId: string, email: string) {
    const chatroom = await this.chatroomModel.findOne({ _id: chatroomId });
    if (!chatroom) throw new NotFoundException('Chat room not found');

    await this.userService.findByEmail(email);

    const updatedChatroom = await this.chatroomModel.findByIdAndUpdate(
      chatroom._id,
      {
        members: chatroom.members.filter((member) => member !== email),
      },
      { new: true },
    );

    return {
      status: 201,
      success: true,
      data: updatedChatroom,
    };
  }

  public async update(id: string, updateChatroomDto: UpdateChatroomDto) {
    const chatroom = await this.chatroomModel.findOne({ _id: id });
    if (!chatroom) throw new NotFoundException('Chat room not found');

    if (updateChatroomDto.members) {
      updateChatroomDto.members = [
        ...chatroom.members,
        ...updateChatroomDto.members,
      ];
    }

    const radam = { ...chatroom, ...updateChatroomDto };
    console.log(radam);

    const updatedChatroom = await this.chatroomModel.findByIdAndUpdate(
      chatroom._id,
      {
        latest_message: updateChatroomDto.latest_message,
        members: updateChatroomDto.members,
      },
    );

    return {
      status: 201,
      success: true,
      data: updatedChatroom,
    };
  }

  public async delete(id: string) {
    const deletedChatroom = await this.chatroomModel.findOneAndDelete({
      _id: id,
    });
    if (!deletedChatroom) throw new NotFoundException('Chat room not found');

    return {
      status: 201,
      success: true,
      data: deletedChatroom,
    };
  }
}
