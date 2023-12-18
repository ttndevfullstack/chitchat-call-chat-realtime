import { BaseApi } from '@/api/base';

export class UserAPI extends BaseApi {
  private prefix = '/user';

  getAllUser(): Promise<any> {
    return this.get(this.prefix + '/all');
  }

  getFriends(email: string): Promise<any> {
    return this.get(this.prefix + '/friends/' + email);
  }

  addFriend(email: string, email_friend: string): Promise<any> {
    return this.post(this.prefix + '/add-friend', { email, email_friend });
  }

  unFriend(email: string, email_friend: string): Promise<any> {
    return this.post(this.prefix + '/unfriend', { email, email_friend });
  }

  joinChannel(id: string, email: string) {
    return this.post(this.prefix, email);
  }
}
