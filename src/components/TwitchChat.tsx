// src/components/TwitchChat.tsx
import React, { useEffect, useState } from 'react';
import tmi from 'tmi.js';

interface ChatMessage {
  username: string;
  message: string;
}

interface TwitchChatProps {
  channel: string;
}

const TwitchChat: React.FC<TwitchChatProps> = ({ channel }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Setup tmi client
    const client = new tmi.Client({
      connection: { reconnect: true },
      channels: [channel],
    });

    client.connect().catch(console.error);

    client.on('message', (_channel, tags, message, self) => {
      if (self) return; // Ignore own messages if sending from here later
      const chatMessage: ChatMessage = {
        username: tags.username || 'unknown',
        message,
      };
      setMessages((prev) => [...prev, chatMessage]);
    });

    return () => {
      client.disconnect();
    };
  }, [channel]);

  return (
    <div style={{ overflowY: 'auto', maxHeight: '500px', padding: '1rem', background: '#f0f0f0' }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <strong>{msg.username}: </strong>
          <span>{msg.message}</span>
        </div>
      ))}
    </div>
  );
};

export default TwitchChat;
