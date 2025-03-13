import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';
import { DeepseekModule } from './deepseek/deepseek.module'; // ✅ Добавляем DeepseekModule

@Module({
  imports: [DeepseekModule], // ✅ Подключаем DeepseekModule
  providers: [ChatGateway],
})
export class AppModule {}
