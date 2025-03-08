import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages: string[] = [];

  async getAIResponse(message: string): Promise<string> {
    // Здесь можно добавить логику для взаимодействия с AI (например, OpenAI API)
    const response = `You said: ${message}`;
    this.messages.push(message); // Сохраняем сообщение в истории
    return response;
  }

  getMessages(): string[] {
    return this.messages; // Возвращаем историю сообщений
  }
}
