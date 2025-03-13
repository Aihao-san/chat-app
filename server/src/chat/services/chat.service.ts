import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private messages: string[] = [];

  async getAIResponse(message: string): Promise<string> {
    return `AI Response to: ${message}`;
  }

  addMessage(message: string): void {
    this.messages.push(message);
  }

  getMessages(): string[] {
    return this.messages;
  }

  async sendMessage(message: string): Promise<{ message: string }> {
    this.addMessage(message);
    const response = await this.getAIResponse(message);
    return { message: response };
  }
}
