// src/components/TwitchChatEmbed.tsx
import React from 'react';

interface TwitchChatEmbedProps {
  channel: string;
  parent: string; // e.g. "localhost" or "yourdomain.com"
}

const TwitchChatEmbed: React.FC<TwitchChatEmbedProps> = ({ channel, parent }) => {
  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full text-white/50">
        No chat available
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.twitch.tv/embed/${channel}/chat?parent=${parent}&darkpopout`}
      height="100%"
      width="100%"
      frameBorder="0"
      scrolling="yes"
      title="Twitch Chat"
      style={{ display: 'block' }}
    />
  );
};

export default TwitchChatEmbed;
