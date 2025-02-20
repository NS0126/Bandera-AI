import React, { useState } from 'react';

const ChatDisplay = ({ messages, handleSendMessage }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sort messages
  const sortedMessages = messages.map((msg) => {
    if (msg.type === 'table') {
      const sortedData = [...msg.text].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      return { ...msg, text: sortedData };
    }
    return msg;
  });

  return (
    <div className={`chat-display ${messages.length === 0 ? 'hidden' : ''}`}>
      {/* Display Messages */}
      {sortedMessages
        .filter((msg) => msg && msg.type) // Ignore null or undefined messages
        .map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="bubble">
              {msg.type === 'table' ? (
                <table>
                  <thead>
                    <tr>
                      {Object.keys(msg.text[0] || {}).map((key) => (
                        <th key={key} onClick={() => handleSort(key)}>
                          {key} {sortConfig.key === key && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {msg.text.map((row, i) => (
                      <tr key={i}>
                        {Object.entries(row).map(([key, value], j) => (
                          <td key={j}>
                            {typeof value === 'object' ? (
                              Object.entries(value).map(([platform, url]) => (
                                <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                                  {platform}
                                </a>
                              ))
                            ) : (
                              value
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChatDisplay;