import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module'; // Импортируйте ChatModule

@Module({
  imports: [ChatModule], // Добавьте ChatModule
})
export class AppModule {}
