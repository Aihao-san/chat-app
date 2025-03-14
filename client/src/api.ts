import axios from 'axios';

const API_URL = 'http://localhost:3000/api/deepseek'; // Используем правильный API-адрес

export const sendMessage = async (message: string): Promise<string> => {
  console.log('📨 Отправка сообщения:', message);

  try {
    const response = await axios.post<{ message: string }>(
      API_URL,
      { message },
      { headers: { 'Content-Type': 'application/json; charset=UTF-8' } }
    );

    console.log('✅ Ответ от сервера:', response.data.message);
    return response.data.message;
  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения:', error);
    return '❌ Ошибка при получении ответа от сервера.';
  }
};

export const getMessages = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${API_URL}/messages`, {
      headers: { Accept: 'application/json; charset=UTF-8' },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при получении сообщений:', error);
    return [];
  }
};
