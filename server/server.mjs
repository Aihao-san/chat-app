// server.mjs
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Обработка подключения клиента
io.on('connection', (socket) => {
  console.log('Пользователь подключился');

  // Обработка сообщений
  socket.on('chat message', (msg) => {
    console.log('Сообщение:', msg);
    io.emit('chat message', msg); // Отправляем сообщение всем клиентам
  });

  // Обработка отключения клиента
  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
