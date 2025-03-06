import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  sendMessage(message: string): string {
    return message; // Пример бизнес-логики
  }
}
