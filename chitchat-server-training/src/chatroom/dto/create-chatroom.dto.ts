import { IsNotEmpty } from 'class-validator';

export class CreateChatroomDto {
  name?: string;

  @IsNotEmpty()
  room_master: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  members: string[];
}
