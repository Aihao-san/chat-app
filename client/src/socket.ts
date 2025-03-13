import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'], // Используем WebSocket
  reconnection: true, // Автоматическое переподключение
});

export default socket;
