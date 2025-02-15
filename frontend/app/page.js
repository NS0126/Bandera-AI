"use client";

import ChatInput from './components/ChatInput';
import ChatDisplay from './components/ChatDisplay';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    setMessages([...messages, { type: 'user', text: message }, { type: data.type, text: data.data }]);
  };

  return (
    <main>
      <center>
        <h1>bandera</h1>
    </center>
      <div className="chat-container">
       <ChatDisplay messages={messages} handleSendMessage={handleSendMessage} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}