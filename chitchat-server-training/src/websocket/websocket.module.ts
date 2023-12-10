import { Global, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MessageModule } from 'src/message/message.module';
import { ChannelModule } from 'src/channel/channel.module';

@Global()
@Module({
  imports: [MessageModule, ChannelModule],
  providers: [WebsocketGateway],
  exports: [WebsocketGateway],
})
export class WebsocketModule {}
