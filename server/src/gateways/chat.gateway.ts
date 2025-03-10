import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { sendMessageToDeepSeek, DeepSeekResponse } from '../deepseek/deepseek';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string): Promise<void> {
    try {
      const response: DeepSeekResponse = await sendMessageToDeepSeek(message); // Обработка сообщения
      this.server.emit('message', response.message); // Отправка ответа всем клиентам
    } catch (error) {
      console.error('Ошибка при обработке сообщения:', error);
      this.server.emit('error', 'Произошла ошибка при обработке сообщения');
    }
  }
}
