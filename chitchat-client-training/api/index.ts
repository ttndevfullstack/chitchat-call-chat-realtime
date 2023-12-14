import type { AxiosInstance } from 'axios';
import { AuthAPI } from './auth';
import { MessageAPI } from './message';
import { ChatroomAPI } from './chatroom';
import { ChannelAPI } from './channel';
import { UserAPI } from './user';

export class Api {
  public readonly auth: AuthAPI;
  public readonly message: MessageAPI;
  public readonly chatroom: ChatroomAPI;
  public readonly channel: ChannelAPI;
  public readonly user: UserAPI;

  constructor(axios: AxiosInstance) {
    this.auth = new AuthAPI(axios);
    this.message = new MessageAPI(axios);
    this.chatroom = new ChatroomAPI(axios);
    this.chatroom = new ChatroomAPI(axios);
    this.channel = new ChannelAPI(axios);
    this.user = new UserAPI(axios);
  }
}
