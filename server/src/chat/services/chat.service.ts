import { Injectable } from '@nestjs/common';
import { sendMessageToDeepSeek, DeepSeekResponse } from '@/deepseek/deepseek'; // Импортируем функцию и тип

@Injectable()
export class ChatService {
  async sendMessage(message: string): Promise<DeepSeekResponse> {
    // Возвращаем DeepSeekResponse
    const response = await sendMessageToDeepSeek(message); // Вызываем функцию из deepseek
    return response; // Возвращаем ответ
  }
}
