import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway'; // Путь обновлён
import { ChatService } from './services/chat.service'; // Путь обновлён

describe('ChatGateway', () => {
  let gateway: ChatGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        ChatService, // Добавьте ChatService
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
