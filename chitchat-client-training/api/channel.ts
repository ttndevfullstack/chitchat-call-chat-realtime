import { BaseApi } from '@/api/base';

export class ChannelAPI extends BaseApi {
  private prefix = '/channel';

  createChannel(data: any): Promise<any> {
    return this.post(this.prefix, data);
  }

  joinChannel(id: string, email: string) {
    return this.post(this.prefix, email);
  }
}
