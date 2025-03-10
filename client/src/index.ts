import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Подключение к серверу

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
const loadingIndicator = document.getElementById('loading') as HTMLDivElement;

if (
  chatWindow &&
  userInput &&
  sendButton &&
  clearChatButton &&
  loadingIndicator
) {
  // Функция для добавления сообщения в чат
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
  sendButton.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    // Добавляем сообщение пользователя в чат
    addMessageToChat(userMessage, true);
    userInput.value = ''; // Очищаем поле ввода

    // Показываем индикатор загрузки
    loadingIndicator.style.display = 'block';

    // Отправляем сообщение на сервер через WebSocket
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
    console.log('Ответ от сервера:', response); // Логируем ответ
    // Добавляем ответ бота в чат
    addMessageToChat(response, false);

    // Скрываем индикатор загрузки
    loadingIndicator.style.display = 'none';
  });

  // Слушаем ошибки от сервера
  socket.on('error', (error: string) => {
    console.error('Ошибка от сервера:', error);

    // Добавляем сообщение об ошибке в чат
    addMessageToChat(error, false);

    // Скрываем индикатор загрузки
    loadingIndicator.style.display = 'none';
  });
} else {
  console.error('Один из элементов DOM не найден. Проверьте HTML-структуру.');
}
