/* @ts-expect-error Suppressing ESLint rules for better code readability
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

// src/components/YouTubeStream.tsx
import React, { useEffect, useState } from 'react';

interface YouTubeStreamProps {
  username: string;
}

// Define types for the YouTube API responses
interface YouTubeChannel {
  id: string;
}

interface YouTubeChannelResponse {
  items?: YouTubeChannel[];
}

interface YouTubeVideoId {
  videoId: string;
}

interface YouTubeSearchItem {
  id: YouTubeVideoId | string;
  snippet?: {
    channelId?: string;
  };
}

interface YouTubeSearchResponse {
  items?: YouTubeSearchItem[];
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
          `/api/youtube?action=channel&username=${cleanUsername}`
        );
        const channelData = await channelResponse.json() as YouTubeChannelResponse;
        
        // If no channel found, try searching for the channel
        let channelId = channelData.items?.[0]?.id;
        if (!channelId) {
          console.debug(
            '%c⚠️ Channel not found directly. Trying search API...',
            'color: #fbbc05; font-style: italic;'
          );
          
          const searchResponse = await fetch(
            `/api/youtube?action=search&username=${cleanUsername}`
          );
          const searchData = await searchResponse.json() as YouTubeSearchResponse;
          
          const firstItem = searchData.items?.[0];
          channelId = typeof firstItem?.id === 'string' 
            ? firstItem.id 
            : (firstItem?.id as YouTubeVideoId)?.videoId || firstItem?.snippet?.channelId || '';
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
          `/api/youtube?action=live&username=${cleanUsername}&channelId=${channelId}`
        );
        const liveStreamData = await liveStreamResponse.json() as YouTubeSearchResponse;
        
        // Fixed type checking for the YouTube API response
        if (liveStreamData.items?.[0]) {
          const firstItem = liveStreamData.items[0];
          const videoIdObj = firstItem.id;
          
          // Handle both string and object video IDs
          const finalVideoId = typeof videoIdObj === 'string' 
            ? videoIdObj
            : 'videoId' in videoIdObj ? videoIdObj.videoId : null;
            
          if (finalVideoId) {
            setVideoId(finalVideoId);
            console.debug(
              '%c✅ SUCCESS: %cFound livestream with ID: %c' + finalVideoId + '\n' +
              '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
              'background: #34A853; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
              'color: #34A853;',
              'color: white; font-weight: bold;',
              'color: #6441a5; font-weight: bold;'
            );
          } else {
            setUseFallback(true);
          }
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
  }, [username, cleanUsername]); // Added cleanUsername as dependency

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
