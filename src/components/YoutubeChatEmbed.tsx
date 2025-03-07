import React, { useEffect } from 'react';

interface YoutubeChatEmbedProps {
  videoId: string | null;
}

const YoutubeChatEmbed: React.FC<YoutubeChatEmbedProps> = ({ videoId }) => {
  useEffect(() => {
    if (!videoId) return;

    // Cool debug header for the component
    console.debug(
      '%c💬 Adrift YouTube Chat Loader 💬\n' +
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      `%cLoading chat for video: %c${videoId}`,
      'font-size: 14px; font-weight: bold; color: #FF0000; text-shadow: 1px 1px 1px rgba(0,0,0,0.3);',
      'color: #FF0000; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;'
    );

    return () => {
      console.debug(
        '%c📤 UNLOADING: %cCleaning up YouTube chat for %c' + videoId,
        'background: #FF0000; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
        'color: #FF0000;',
        'color: white; font-weight: bold;'
      );
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white/50">
        No chat available
      </div>
    );
  }

  return (
    <iframe
      src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'}&dark_theme=1`}
      height="100%"
      width="100%"
      frameBorder="0"
      scrolling="yes"
      title="YouTube Chat"
      style={{ display: 'block' }}
    />
  );
};

export default YoutubeChatEmbed;
