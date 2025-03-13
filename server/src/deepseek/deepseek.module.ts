import { Module } from '@nestjs/common';
import { DeepseekController } from './deepseek.controller';

@Module({
  controllers: [DeepseekController],
})
export class DeepseekModule {}
