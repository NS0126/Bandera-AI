"use client";
import { useState } from 'react';

export default function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a command..."
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
