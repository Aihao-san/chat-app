import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { sendMessageToDeepSeek } from './deepseek/deepseek';
import path from 'path';

const app = express();
const server = createServer(app);

// Настройка CORS для WebSocket
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3001', // Разрешаем запросы от клиента
    methods: ['GET', 'POST'],
  },
});

// Разрешаем CORS для HTTP-запросов
app.use(cors());

// Для обработки JSON-запросов
app.use(express.json());

// Обслуживаем статические файлы из папки "client/build"
const staticPath = path.join(__dirname, '../../client/build');
app.use(express.static(staticPath));

// Маршрут для обработки сообщений от клиента
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log('Запрос от клиента:', { message }); // Логируем запрос

  try {
    const response = await sendMessageToDeepSeek(message, history);
    history = response.history || []; // Обновляем историю
    res.json({ message: response.message }); // Отправляем ответ клиенту
  } catch (error) {
    console.error('Ошибка при запросе к DeepSeek:', error);
    res.status(500).json({ error: 'Ошибка при запросе к DeepSeek' });
  }
});

// Обработка WebSocket-соединений
io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);

  socket.on('chatMessage', async (message) => {
    try {
      const response = await sendMessageToDeepSeek(message, history);
      history = response.history || []; // Обновляем историю
      socket.emit('chatMessage', response.message); // Отправляем ответ клиенту
    } catch (error) {
      console.error('Ошибка при запросе к DeepSeek:', error);
      socket.emit('error', 'Ошибка при запросе к DeepSeek');
    }
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

// Все остальные запросы перенаправляем на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Глобальная переменная для хранения истории диалога
let history: Array<{ role: string; content: string }> = [];

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
