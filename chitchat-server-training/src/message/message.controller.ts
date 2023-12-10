import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':chatroomId')
  findAllByChatroomId(@Param('chatroomId') chatroomId: string) {
    return this.messageService.findAllByChatroomId(chatroomId);
  }

  @Post('send')
  sendMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(id);
  }

  @Delete('recall/:id')
  recall(@Param('id') id: string) {
    return this.messageService.recall(id);
  }
}
