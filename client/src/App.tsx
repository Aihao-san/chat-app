import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { sendMessage, getMessages } from './api';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Загружаем историю сообщений при монтировании компонента
    getMessages().then((data) => setMessages(data));
  }, []);

  const handleSendMessage = async () => {
    const aiResponse = await sendMessage(message);
    setResponse(aiResponse);
    setMessage('');
    // Обновляем историю сообщений
    getMessages().then((data) => setMessages(data));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chat with AI</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        style={{ width: '300px', padding: '10px', marginRight: '10px' }}
      />
      <button
        onClick={handleSendMessage}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        Send
      </button>
      <div style={{ marginTop: '20px' }}>
        <strong>Response:</strong> {response}
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2>Message History</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;