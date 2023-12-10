import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  room_id: string;

  @IsNotEmpty()
  member: string[];
}
