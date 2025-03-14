import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'], // WebSocket only
  reconnection: true,
});

document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById('chat-window') as HTMLDivElement;
  const userInput = document.getElementById('user-input') as HTMLInputElement;
  const sendButton = document.getElementById(
    'send-button'
  ) as HTMLButtonElement;
  const clearChatButton = document.getElementById(
    'clear-chat'
  ) as HTMLButtonElement;

  if (!chatWindow || !userInput || !sendButton || !clearChatButton) {
    console.error('❌ Ошибка: не найдены элементы чата!');
    return;
  }

  // Функция добавления сообщений в чат
  const addMessageToChat = (message: string, isUser = true) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add(
      'message',
      isUser ? 'user-message' : 'bot-message'
    );
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  // Обработка отправки сообщения
  sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    console.log('📨 Кнопка отправки нажата:', userMessage);

    addMessageToChat(userMessage, true);
    userInput.value = '';

    // Отправляем через WebSocket
    socket.emit('message', userMessage);
  });

  // Обработка нажатия Enter
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });

  // Очистка чата
  clearChatButton.addEventListener('click', () => {
    console.log('🧹 Очистка чата');
    chatWindow.innerHTML = '';
  });

  // Обработка ответа сервера
  socket.on('message', (response: string) => {
    console.log('📩 Получено сообщение от сервера:', response);
    addMessageToChat(response, false);
  });

  // Обработка ошибок
  socket.on('error', (error: string) => {
    console.error('⚠️ Ошибка от сервера:', error);
    addMessageToChat('Ошибка: ' + error, false);
  });

  console.log('✅ Кнопки и WebSocket настроены');
});
