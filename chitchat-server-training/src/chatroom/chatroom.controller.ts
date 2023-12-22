import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { CreateChatroomDto } from './dto/create-chatroom.dto';
import { UpdateChatroomDto } from './dto/update-chatroom.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { GetChatRoomParams } from './dto/get-chatroom-params';
import { UpdateChannelDto } from 'src/channel/dto/update-channel.dto';

// @UseGuards(JwtAuthGuard)
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Post('all')
  findAllOfUser(@Body() params: GetChatRoomParams) {
    return this.chatroomService.findAllByEmail(params);
  }

  @Get('members/:chatroom_id')
  findAllMember(@Param('chatroom_id') chatroom_id: string) {
    return this.chatroomService.findAllMember(chatroom_id);
  }

  @Get(':chatroom_id')
  findById(@Param('chatroom_id') chatroom_id: string) {
    return this.chatroomService.findOneById(chatroom_id);
  }

  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomService.create(createChatroomDto);
  }

  @Patch('join/:chatroom_id')
  joinChatRoom(
    @Param('chatroom_id') chatroom_id: string,
    @Body() email: string,
  ) {
    return this.chatroomService.joinChatRoom(chatroom_id, email);
  }

  @Patch('leave/:chatroom_id')
  leaveChatRoom(
    @Param('chatroom_id') chatroom_id: string,
    @Body() email: string,
  ) {
    return this.chatroomService.leaveChatRoom(chatroom_id, email);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatroomDto: UpdateChatroomDto,
  ) {
    return this.chatroomService.update(id, updateChatroomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomService.delete(id);
  }
}
