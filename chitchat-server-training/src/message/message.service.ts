import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/schema/message.schema';
import { Model } from 'mongoose';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatroomService: ChatroomService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  public async findOne(messageId: string) {
    const message = await this.messageModel.findOne({ _id: messageId });

    if (!message) throw new NotFoundException('Message not found');

    return {
      status: 201,
      success: true,
      data: message,
    };
  }

  public async findAllByChatroomId(chatroomId: string) {
    const chatroom = await this.chatroomService.findOneById(chatroomId);

    const messageList = await this.messageModel.find({
      chatroom_id: chatroom.data._id,
    });

    return {
      status: 201,
      success: true,
      data: messageList,
    };
  }

  public async create(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();

    await this.chatroomService.update(createMessageDto.chatroom_id, {
      latest_message: createMessageDto.content,
    });

    if (!createdMessage)
      throw new BadRequestException('Create message failure');

    await this.websocketGateway.handleSendMessage(
      JSON.stringify(createdMessage),
    );

    return {
      status: 201,
      success: true,
      data: createdMessage,
    };
  }

  public async remove(id: string) {
    const message = await this.messageModel.findOne({ _id: id });

    if (!message) throw new NotFoundException('Message not found');

    const deletedMessage = await this.messageModel.updateOne(
      { _id: message._id },
      { is_delete: true },
    );

    return {
      status: 201,
      success: true,
      data: deletedMessage,
    };
  }

  public async recall(id: string) {
    const message = await this.messageModel.findOne({ _id: id });

    if (!message) throw new NotFoundException('Message not found');

    const recalledMessage = await this.messageModel.updateOne(
      { _id: message._id },
      { is_delete: true, is_recall: true },
    );

    this.websocketGateway.handleSendMessage(recalledMessage);

    return {
      status: 201,
      success: true,
      data: recalledMessage,
    };
  }
}
