import React, { useState, useEffect } from 'react';
import socket from './socket'; // Импортируем настройку WebSocket

const App = () => {
  const [message, setMessage] = useState(''); // Состояние для ввода сообщения
  const [messages, setMessages] = useState<string[]>([]); // Состояние для списка сообщений

  // Обработка входящих сообщений
  useEffect(() => {
    // Слушаем событие 'message' от сервера
    socket.on('message', (response: string) => {
      setMessages((prevMessages) => [...prevMessages, response]); // Добавляем ответ в список
    });

    // Слушаем событие 'error' от сервера
    socket.on('error', (error: string) => {
      console.error('Ошибка от сервера:', error);
    });

    // Отключаем слушатели при размонтировании компонента
    return () => {
      socket.off('message');
      socket.off('error');
    };
  }, []);

  // Отправка сообщения
  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message); // Отправляем сообщение на сервер
      setMessage(''); // Очищаем поле ввода
    }
  };

  return (
    <div>
      <h1>Чат с ИИ</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p> // Отображаем все сообщения
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Обновляем состояние при вводе
        placeholder="Введите сообщение"
      />
      <button onClick={handleSendMessage}>Отправить</button>
    </div>
  );
};

export default App;
