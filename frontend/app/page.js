"use client";

import ChatInput from './components/ChatInput';
import ChatDisplay from './components/ChatDisplay';
import { useState } from 'react';
import Image from 'next/image'; // Import Image component from Next.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'; // Import the specific icon

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ Fixed useState syntax

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
      <center style={{ marginTop: '-80px' }}>
        <Image src="/logo1.png" alt="Logo" width={80} height={100} priority /> <h1 className="brand-name">Bandera</h1>
      </center>

      {/* Sidebar Toggle Icon */}
      <button className="sidebar-toggle-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FontAwesomeIcon icon={faAnglesRight} /> {/* Use FontAwesome icon */}
      </button>

      {/* Sidebar Component */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close-button" onClick={() => setIsSidebarOpen(false)}>
          ×
        </button>
        <div className="sidebar-content">
          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <input type="text" placeholder="Search..." />
            <button>Filter</button>
          </div>

          {/* Command Buttons */}
          <div className="command-buttons">
            <button onClick={() => handleSendMessage("Find Work Email")}>Find Work Email</button>
            <button onClick={() => handleSendMessage("Generate Sales Emails")}>Generate Sales Emails</button>
            <button onClick={() => handleSendMessage("Enrich those profiles")}>Enrich Profiles</button>
          </div>
        </div>
      </div>

      <div className="chat-container">
        <ChatDisplay messages={messages} handleSendMessage={handleSendMessage} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </main>
  );
}