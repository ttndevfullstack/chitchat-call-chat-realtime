import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  sender: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  chatroom_id: string;
}
