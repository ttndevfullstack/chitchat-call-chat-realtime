import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  room_id: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  time_start: string;

  participants?: string[];
}
