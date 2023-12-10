import { BaseApi } from '@/api/base';

export class ChatroomAPI extends BaseApi {
  private prefix = '/chatroom';

  getAllChatroomByEmail(email: string): Promise<any> {
    return this.get(this.prefix + '/all/' + email);
  }
}
