import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/channel/channel.service';

@WebSocketGateway({ namespace: 'events' })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly channelService: ChannelService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect')
  public async handleConnection(client: Socket) {
    let isVerified;

    const token = client.handshake.query.token.toString();
    if (token) {
      isVerified = await this.authService.verifyToken(token);
    }

    if (!isVerified) return client.disconnect();
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('disconnect')
  public async handleDisconnect(client: Socket) {
    client.disconnect();
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('offer')
  public async handleOffer(@MessageBody() data: any) {
    console.log('offer:', data);
    this.server.emit('offer', data);
  }

  @SubscribeMessage('answer')
  public async handleAnswer(@MessageBody() data: any) {
    console.log('answer:', data);
    this.server.emit('answer', data);
  }

  @SubscribeMessage('iceCandidate')
  public async handleIceCandidate(@MessageBody() data: any) {
    console.log('answer:', data);
    this.server.emit('iceCandidate', data);
  }

  @SubscribeMessage('member_joined')
  public async handleEvent(@MessageBody() data: any) {
    this.server.emit('member_joined', data);
  }

  @SubscribeMessage('member_left')
  public async handleMemberLeft(@MessageBody() data: any) {
    this.server.emit('member_left', data);
  }

  @SubscribeMessage('message_from_peer')
  public async handleMessageFromPeer(@MessageBody() data: any) {
    this.server.emit('message_from_peer', data);
  }
}
