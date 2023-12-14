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
import { ChatroomService } from 'src/chatroom/chatroom.service';

@WebSocketGateway({ namespace: 'events' })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly chatroomService: ChatroomService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect')
  public async handleConnection(client: Socket) {
    // Validate User
    const token = client.handshake.query.token.toString();
    if (!token) return;
    const user = await this.authService.verifyTokenAndUpdateStatus(
      token,
      'online',
    );
    if (!user) return client.disconnect();
    await this.chatroomService.updateStatus(user?.email, 'online');

    console.log(`Client connected: ${client.id}`);
    this.server.emit('user_status', JSON.stringify(user));
  }

  @SubscribeMessage('disconnect')
  public async handleDisconnect(client: Socket) {
    const token = client.handshake.query.token.toString();
    if (!token) return;
    const user = await this.authService.verifyTokenAndUpdateStatus(
      token,
      'offline',
    );
    if (!user) return client.disconnect();
    await this.chatroomService.updateStatus(user?.email, 'offline');
    client.disconnect();
    console.log(`Client disconnected: ${client.id}`);
    this.server.emit('user_status', JSON.stringify({ user }));
  }

  @SubscribeMessage('offer')
  public async handleOffer(@MessageBody() data: any) {
    // const channel = await this.channelService.findOneById();
    console.log('offer:', data);
    this.server.emit('offer', data);
  }

  @SubscribeMessage('send_message')
  public async handleSendMessage(created_message: any) {
    console.log(created_message);
    this.server.emit('send_message', created_message);
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
