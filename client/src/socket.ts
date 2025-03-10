// client/src/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Подключение к серверу

export default socket;
