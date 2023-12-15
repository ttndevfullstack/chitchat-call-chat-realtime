import { BaseApi } from '@/api/base';

export class UserAPI extends BaseApi {
  private prefix = '/user';

  getAllUser(): Promise<any> {
    return this.get(this.prefix + '/all');
  }

  getFriends(email: string): Promise<any> {
    return this.get(this.prefix + '/friends/' + email);
  }

  joinChannel(id: string, email: string) {
    return this.post(this.prefix, email);
  }
}
