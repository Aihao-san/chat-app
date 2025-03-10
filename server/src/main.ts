import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Импортируем NestExpressApplication
import { join } from 'path'; // Импортируем join для работы с путями

async function bootstrap() {
  // Создаём приложение с использованием NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка раздачи статических файлов из папки client/build
  app.useStaticAssets(join(__dirname, '..', 'client', 'build'));

  // Перенаправление всех запросов на index.html (для SPA)
  app.setBaseViewsDir(join(__dirname, '..', 'client', 'build'));
  app.setViewEngine('html');

  // Запуск сервера на порту 3000
  await app.listen(3000);
  console.log('Server is running on port 3000');
}
bootstrap();
