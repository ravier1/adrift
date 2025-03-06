// src/components/YouTubeStream.tsx
import React, { useEffect } from 'react';

interface YouTubeStreamProps {
  username: string;
}

const YouTubeStream: React.FC<YouTubeStreamProps> = ({ username }) => {
  const cleanUsername = username.replace(/^@/, '');
  const embedUrl = `https://www.youtube.com/embed?frame=1&listType=user_uploads&list=${cleanUsername}&live=1&autoplay=1`;

  useEffect(() => {
    console.log('Clean username:', cleanUsername);
    console.log('Embed URL:', embedUrl);
  }, [cleanUsername, embedUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        src={embedUrl}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeStream;
