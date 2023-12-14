import { IsNotEmpty } from 'class-validator';

export class UpdateChannelDto {
  @IsNotEmpty()
  room_id: string;

  @IsNotEmpty()
  member: string;
}
