import { IsNotEmpty } from 'class-validator';

export class GetChatRoomParams {
  @IsNotEmpty()
  email: string;

  room_type?: string;
}
