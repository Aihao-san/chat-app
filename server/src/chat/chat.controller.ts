import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service'; // Убедитесь, что путь правильный

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body('message') message: string) {
    const response = await this.chatService.getAIResponse(message);
    return { response };
  }

  @Get('messages')
  async getMessages() {
    return this.chatService.getMessages();
  }
}
