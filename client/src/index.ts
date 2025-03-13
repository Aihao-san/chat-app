import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Подключение к серверу

document.addEventListener('DOMContentLoaded', () => {
  const chatWindow = document.getElementById(
    'chat-window'
  ) as HTMLDivElement | null;
  const userInput = document.getElementById(
    'user-input'
  ) as HTMLInputElement | null;
  const sendButton = document.getElementById(
    'send-button'
  ) as HTMLButtonElement | null;
  const clearChatButton = document.getElementById(
    'clear-chat'
  ) as HTMLButtonElement | null;

  if (!chatWindow || !userInput || !sendButton || !clearChatButton) {
    console.error('Ошибка: не найдены элементы чата!');
    return;
  }

  // Функция для добавления сообщений в чат
  const addMessageToChat = (message: string, isUser = true) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add(
      'message',
      isUser ? 'user-message' : 'bot-message'
    );
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Прокрутка вниз
  };

  // Обработка отправки сообщения
  sendButton.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    addMessageToChat(userMessage, true); // Добавляем сообщение пользователя в чат
    userInput.value = ''; // Очищаем поле ввода

    // Отправляем сообщение через WebSocket
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
    chatWindow.innerHTML = ''; // Очищаем содержимое чата
  });

  // Слушаем ответ от сервера
  socket.on('message', (response: string) => {
    console.log('Ответ от сервера:', response);
    addMessageToChat(response, false);
  });

  // Слушаем ошибки от сервера
  socket.on('error', (error: string) => {
    console.error('Ошибка от сервера:', error);
    addMessageToChat(error, false);
  });
});
