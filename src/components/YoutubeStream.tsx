// src/components/YouTubeStream.tsx
import React, { useEffect, useState } from 'react';
import { env } from '~/env';

interface YouTubeStreamProps {
  username: string;
}

const YouTubeStream: React.FC<YouTubeStreamProps> = ({ username }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const cleanUsername = username.replace(/^@/, '');
  
  // Fallback embed URL using the old method
  const fallbackEmbedUrl = `https://www.youtube.com/embed?frame=1&listType=user_uploads&list=${cleanUsername}&live=1&autoplay=1`;
  
  useEffect(() => {
    if (!username) return;
    
    // Cool debug header for the component
    console.debug(
      '%c🚀 Adrift YouTube Stream Loader 🚀\n' +
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      `%cLoading stream for: %c${cleanUsername}`,
      'font-size: 14px; font-weight: bold; color: #FF0000; text-shadow: 1px 1px 1px rgba(0,0,0,0.3);',
      'color: #6441a5; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;'
    );
    
    const fetchLiveStream = async () => {
      try {
        // Step 1: Get the channel ID from the username
        console.debug(
          '%c🔍 STEP 1: %cSearching for channel...',
          'color: #4285f4; font-weight: bold;', 'color: #cccccc;'
        );
        
        const channelResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${cleanUsername}&key=${env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const channelData = await channelResponse.json();
        
        // If no channel found, try searching for the channel
        let channelId = channelData.items?.[0]?.id;
        if (!channelId) {
          console.debug(
            '%c⚠️ Channel not found directly. Trying search API...',
            'color: #fbbc05; font-style: italic;'
          );
          
          const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${cleanUsername}&type=channel&key=${env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
          );
          const searchData = await searchResponse.json();
          channelId = searchData.items?.[0]?.id?.channelId || searchData.items?.[0]?.snippet?.channelId;
        }
        
        if (!channelId) {
          console.debug(
            '%c❌ FAILED: %cCould not find channel ID for %c' + cleanUsername,
            'background: #EA4335; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            'color: #EA4335;',
            'color: white; font-weight: bold;'
          );
          setUseFallback(true);
          return;
        }
        
        console.debug(
          '%c✅ SUCCESS: %cFound channel ID: %c' + channelId,
          'background: #34A853; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
          'color: #34A853;',
          'color: white; font-weight: bold;'
        );
        
        // Step 2: Search for live streams on the channel
        console.debug(
          '%c🔍 STEP 2: %cLooking for active livestream...',
          'color: #4285f4; font-weight: bold;', 'color: #cccccc;'
        );
        
        const liveStreamResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const liveStreamData = await liveStreamResponse.json();
        
        // If we found a live stream, use its videoId
        if (liveStreamData.items && liveStreamData.items.length > 0) {
          const liveVideoId = liveStreamData.items[0].id.videoId;
          setVideoId(liveVideoId);
          
          console.debug(
            '%c✅ SUCCESS: %cFound livestream with ID: %c' + liveVideoId + '\n' +
            '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            'background: #34A853; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            'color: #34A853;',
            'color: white; font-weight: bold;',
            'color: #6441a5; font-weight: bold;'
          );
        } else {
          console.debug(
            '%c⚠️ WARNING: %cNo livestream found for channel: %c' + channelId,
            'background: #FBBC05; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            'color: #FBBC05;',
            'color: white; font-weight: bold;'
          );
          setUseFallback(true);
        }
      } catch (error) {
        console.error(
          '%c❌ ERROR: %cFailed to fetch YouTube data:',
          'background: #EA4335; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
          'color: #EA4335;',
          error
        );
        setUseFallback(true);
      }
    };

    fetchLiveStream().catch(console.error);
  }, [cleanUsername]);

  // Debug message for which method is being used
  useEffect(() => {
    if (useFallback) {
      console.debug(
        '%c📺 FALLBACK MODE %c\n' +
        'Using the traditional embed method\n' +
        '%c' + fallbackEmbedUrl + '\n' +
        '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'background: #FBBC05; color: black; padding: 3px 7px; border-radius: 3px; font-weight: bold;',
        'color: #FBBC05; font-weight: bold;',
        'color: #cccccc; font-style: italic;',
        'color: #6441a5; font-weight: bold;'
      );
    } else if (videoId) {
      console.debug(
        '%c🎬 DIRECT MODE %c\n' +
        'Using the direct video ID embed method\n' +
        '%c' + videoId + '\n' +
        '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'background: #34A853; color: white; padding: 3px 7px; border-radius: 3px; font-weight: bold;',
        'color: #34A853; font-weight: bold;',
        'color: #cccccc; font-style: italic;',
        'color: #6441a5; font-weight: bold;'
      );
    }
  }, [useFallback, videoId, fallbackEmbedUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        src={videoId && !useFallback ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : fallbackEmbedUrl}
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
