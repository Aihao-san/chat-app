import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest'; // Используем default import
import { AppModule } from './../src/app.module';
import { Server } from 'http'; // Импортируем тип Server из модуля http

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', async () => {
    // Явно указываем тип для httpServer
    const httpServer = app.getHttpServer() as Server;

    await request(httpServer)
      .get('/')
      .expect(200) // Объединяем в одну строку
      .expect('Hello World!');
  });
});
