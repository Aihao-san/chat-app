import { sendMessageToDeepSeek } from './deepseek.js';

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

    try {
      // Отправляем сообщение в DeepSeek
      const botResponse = await sendMessageToDeepSeek(userMessage);

      // Добавляем ответ бота в чат
      addMessageToChat(botResponse.message, false);
    } catch (error) {
      console.error('Ошибка:', error);
      let errorMessage = 'Произошла ошибка при обработке вашего сообщения.';

      if (error instanceof Error) {
        errorMessage = error.message; // Используем сообщение об ошибке, если оно есть
      }

      addMessageToChat(errorMessage, false);
    } finally {
      // Скрываем индикатор загрузки
      loadingIndicator.style.display = 'none';
    }
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
} else {
  console.error('Один из элементов DOM не найден. Проверьте HTML-структуру.');
}
