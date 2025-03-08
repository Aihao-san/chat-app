import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Укажите адрес вашего React-приложения
    methods: 'GET,POST',
    credentials: true,
  });
  await app.listen(3000);
  console.log(`Server is running on port 3000`);
}
bootstrap();
