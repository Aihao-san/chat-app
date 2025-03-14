import React, { useState, useEffect } from 'react';
import socket from './socket';
import CodeBlock from './components/CodeBlock';

const App = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >([]);

  useEffect(() => {
    socket.on('message', (response: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, isUser: false },
      ]);
    });

    socket.on('error', (error: string) => {
      console.error('Ошибка WebSocket:', error);
    });

    return () => {
      socket.off('message');
      socket.off('error');
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, isUser: true },
      ]);
      socket.emit('message', input);
      setInput('');
    }
  };

  const isCodeBlock = (text: string) => {
    // Проверяем, начинается ли текст с ``` и заканчивается ли на ```
    return text.startsWith('```') && text.endsWith('```');
  };

  const extractCodeContent = (text: string) => {
    // Убираем тройные кавычки в начале и конце
    return text.slice(3, -3).trim();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Чат с DeepSeek</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '300px',
          overflowY: 'scroll',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => {
          const isCode = isCodeBlock(msg.text.trim());
          const codeContent = isCode ? extractCodeContent(msg.text.trim()) : '';

          return (
            <div
              key={index}
              style={{
                textAlign: msg.isUser ? 'right' : 'left',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: msg.isUser ? '#007bff' : '#f1f1f1',
                  color: msg.isUser ? '#fff' : '#000',
                }}
              >
                {isCode ? (
                  <CodeBlock language="python" code={codeContent} />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: '80%', padding: '10px', marginRight: '10px' }}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSendMessage} style={{ padding: '10px 20px' }}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default App;
