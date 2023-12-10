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

@UseGuards(JwtAuthGuard)
@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get(':chatroomId')
  findById(@Param('chatroomId') chatroomId: string) {
    return this.chatroomService.findOneById(chatroomId);
  }

  @Get('all/:email')
  findAllOfUser(@Param('email') email: string) {
    return this.chatroomService.findAllByEmail(email);
  }

  @Post()
  create(@Body() createChatroomDto: CreateChatroomDto) {
    return this.chatroomService.create(createChatroomDto);
  }

  @Patch('join/:chatroomId')
  joinChatRoom(@Param('chatroomId') chatroomId: string, @Body() email: string) {
    return this.chatroomService.joinChatRoom(chatroomId, email);
  }

  @Patch('leave/:chatroomId')
  leaveChatRoom(
    @Param('chatroomId') chatroomId: string,
    @Body() email: string,
  ) {
    return this.chatroomService.leaveChatRoom(chatroomId, email);
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
    return this.chatroomService.remove(id);
  }
}
