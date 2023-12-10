import { BaseApi } from '@/api/base';
import type { Message } from '@/types/common';

export class MessageAPI extends BaseApi {
  private prefix = '/message';

  sendMessage(message: Message): Promise<any> {
    return this.post(this.prefix + '/send', message);
  }

  getMessageInChatroom(chatroomId: string): Promise<any> {
    return this.get(this.prefix + '/' + chatroomId);
  }

  deleteMessage(messageId: string): Promise<any> {
    return this.delete(this.prefix + '/' + messageId);
  }

  recallMessage(messageId: string): Promise<any> {
    return this.post(this.prefix + '/recall/' + messageId);
  }
}
