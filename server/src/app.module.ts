// server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  providers: [ChatGateway],
})
export class AppModule {}
