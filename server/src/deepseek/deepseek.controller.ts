import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { sendMessageToDeepSeek } from './deepseek';

const maxHistoryLength = 10; // ✅ Ограничение на 10 сообщений в истории
let chatHistory: Array<{ role: string; content: string }> = [];

@Controller('api/deepseek')
export class DeepseekController {
  @Post()
  async chat(@Body() body: any) {
    try {
      console.log('📩 Получены данные из запроса:', body);

      if (!body || typeof body !== 'object' || !body.message) {
        console.error('❌ Ошибка: тело запроса некорректно!', body);
        throw new BadRequestException(
          'Некорректное тело запроса: message отсутствует',
        );
      }

      let message: string = String(body.message).trim();
      console.log('📥 Обработанное сообщение перед отправкой:', message);

      // Удаляем старые ошибки кодировки
      chatHistory = chatHistory.filter(
        (entry) => !entry.content.includes('??????'),
      );

      // Добавляем новое сообщение
      chatHistory.push({ role: 'user', content: message });

      // Обрезаем историю, если превышен лимит
      if (chatHistory.length > maxHistoryLength) {
        chatHistory = chatHistory.slice(-maxHistoryLength);
      }

      const response = await sendMessageToDeepSeek(message, chatHistory);

      chatHistory.push({ role: 'assistant', content: response.message });

      return response;
    } catch (error) {
      console.error('❌ Ошибка обработки входящего сообщения:', error);
      throw error;
    }
  }
}
