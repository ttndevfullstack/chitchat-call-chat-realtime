import { IsNotEmpty } from 'class-validator';

export class GetChatRoomParams {
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  type?: string;
}
