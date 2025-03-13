import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './services/chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async sendMessage(@Body('message') message: string) {
    const response = await this.chatService.getAIResponse(message);
    this.chatService.addMessage(message);
    return { response };
  }

  @Get('messages')
  async getMessages() {
    return this.chatService.getMessages();
  }
}
