import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { sendMessageToDeepSeek } from '../deepseek/deepseek'; // Подключаем функцию отправки сообщений

@WebSocketGateway({ cors: { origin: '*' } }) // Разрешаем CORS
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    client: Socket,
  ): Promise<void> {
    console.log(`Получено сообщение от клиента: ${data}`);

    try {
      const response = await sendMessageToDeepSeek(data); // Отправляем в DeepSeek API
      this.server.emit('message', response.message); // Отправляем ответ клиентам
    } catch (error) {
      console.error('Ошибка при запросе к DeepSeek:', error);
      client.emit('error', 'Ошибка обработки сообщения.');
    }
  }
}
