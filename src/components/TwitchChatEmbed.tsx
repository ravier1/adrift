// src/components/TwitchChatEmbed.tsx
import React from 'react';

interface TwitchChatEmbedProps {
  channel: string;
  parent: string; // e.g. "localhost" or "yourdomain.com"
}

const TwitchChatEmbed: React.FC<TwitchChatEmbedProps> = ({ channel, parent }) => {
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
