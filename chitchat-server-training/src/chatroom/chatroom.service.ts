import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from 'src/schema/chatroom.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';

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

  public async findAllByEmail(email: string) {
    // test
    const username = email.split('@')[0];
    const chatroomList = await this.chatroomModel.find({
      $or: [{ roomMaster: username }, { members: { $in: [username] } }],
    });

    return {
      status: 201,
      success: true,
      data: chatroomList,
    };
  }

  public async create(createChatroomDto: CreateChatroomDto) {
    let chatroomName;

    if (!createChatroomDto.name) {
      createChatroomDto.members.forEach(
        (member) => chatroomName + ', ' + member.toString(),
      );
    }

    const createdChatroom = new this.chatroomModel({
      ...createChatroomDto,
      name: createChatroomDto.name || chatroomName,
    });

    await createdChatroom.save();

    if (!createdChatroom)
      throw new BadRequestException('Create chatroom failure');

    return {
      status: 201,
      success: true,
      data: createdChatroom,
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

    // websocket answer

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

    // websocket answer

    return {
      status: 201,
      success: true,
      data: updatedChatroom,
    };
  }

  public async update(id: string, updateChatroomDto: UpdateChatroomDto) {
    const chatroom = await this.chatroomModel.findOne({ _id: id });

    if (!chatroom) throw new NotFoundException('Chat room not found');

    const updatedChatroom = await this.chatroomModel.findByIdAndUpdate(
      chatroom._id,
      {
        ...updateChatroomDto,
        members: { ...chatroom.members, ...updateChatroomDto.members },
      },
    );

    return {
      status: 201,
      success: true,
      data: updatedChatroom,
    };
  }

  public async remove(id: string) {
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
