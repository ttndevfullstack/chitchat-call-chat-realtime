import { BaseApi } from '@/api/base';

export class ChatroomAPI extends BaseApi {
  private prefix = '/chatroom';

  getAllChatroomByEmail(params: any): Promise<any> {
    return this.post(this.prefix + '/all', params);
  }

  getChatroomById(chatroom_id: any): Promise<any> {
    return this.get(this.prefix + '/' + chatroom_id);
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
