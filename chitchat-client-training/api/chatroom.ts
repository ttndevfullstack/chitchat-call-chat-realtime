import { BaseApi } from '@/api/base';

export class ChatroomAPI extends BaseApi {
  private prefix = '/chatroom';

  getAllChatroomByEmail(params: any): Promise<any> {
    return this.post(this.prefix + '/all', params);
  }

  getAllMember(chatroom_id: string): Promise<any> {
    return this.get(this.prefix + '/members/' + chatroom_id);
  }

  create(params: any): Promise<any> {
    return this.post(this.prefix, params);
  }

  remove(chatroom_id: string): Promise<any> {
    return this.delete(this.prefix + '/' + chatroom_id);
  }
}
