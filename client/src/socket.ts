import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // Используем одинаковый URL для Electron и браузера

const socket = io(SERVER_URL, {
  transports: ['websocket'],
  reconnection: true,
});

socket.on('connect', () => {
  console.log('✅ WebSocket подключен');
});

socket.on('disconnect', () => {
  console.warn('❌ WebSocket отключен');
});

socket.on('connect_error', (error) => {
  console.error('⚠️ Ошибка подключения к WebSocket:', error);
});

export default socket;
