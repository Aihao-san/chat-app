import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';

@Module({
  providers: [ChatGateway, ChatService], // Добавьте ChatService
})
export class ChatModule {}
