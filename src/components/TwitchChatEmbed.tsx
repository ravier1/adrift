// src/components/TwitchChatEmbed.tsx
import React, { useEffect } from 'react';

interface TwitchChatEmbedProps {
  channel: string;
  parent: string; // e.g. "localhost" or "yourdomain.com"
}

const TwitchChatEmbed: React.FC<TwitchChatEmbedProps> = ({ channel, parent }) => {
  // Use localhost for development, otherwise use the domain from env
  const domain = process.env.NODE_ENV === 'development' ? 'localhost' : parent;

  useEffect(() => {
    if (!channel) return;

    // Cool debug header for the component
    console.debug(
      '%c💬 Adrift Twitch Chat Loader 💬\n' +
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      `%cLoading chat for: %c${channel}`,
      'font-size: 14px; font-weight: bold; color: #6441a5; text-shadow: 1px 1px 1px rgba(0,0,0,0.3);',
      'color: #6441a5; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;'
    );

    console.debug(
      '%c🔍 DETAILS:\n' +
      `%cChannel: %c${channel}\n` +
      `%cDomain: %c${domain}\n` +
      `%cEmbed URL: %chttps://www.twitch.tv/embed/${channel}/chat?parent=${domain}&darkpopout\n` +
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      'color: #4285f4; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-style: italic;',
      'color: #6441a5; font-weight: bold;'
    );

    return () => {
      console.debug(
        '%c📤 UNLOADING: %cCleaning up Twitch chat for %c' + channel,
        'background: #6441a5; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
        'color: #6441a5;',
        'color: white; font-weight: bold;'
      );
    };
  }, [channel, domain]);

  return (
    <iframe
      src={`https://www.twitch.tv/embed/${channel}/chat?parent=${domain}&darkpopout`}
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
