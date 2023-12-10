import { UserStatus } from 'src/common/enums/enums';

export class UpdateStatusDto {
  email: string;
  status: UserStatus;
}
