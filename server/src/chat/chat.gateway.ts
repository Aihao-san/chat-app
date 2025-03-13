import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './services/chat.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: string): Promise<void> {
    const response = await this.chatService.sendMessage(data);
    this.server.emit('message', response.message);
  }
}
