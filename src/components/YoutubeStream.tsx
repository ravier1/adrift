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

interface ScrapeResponse {
  channelId?: string;
  error?: string;
}

const YouTubeStream: React.FC<YouTubeStreamProps> = ({ username }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const cleanUsername = username.replace(/^@/, '');
  
  // Updated fallback embed URL using channel ID
  const fallbackEmbedUrl = channelId 
    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}`
    : `https://www.youtube.com/embed?frame=1&listType=user_uploads&list=${cleanUsername}&live=1&autoplay=1`;

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

        // Handle rate limit error
        if (channelResponse.status === 429) {
          console.debug(
            '%c⚠️ RATE LIMIT: %cAPI quota exceeded, falling back to channel ID method...',
            'background: #FF5722; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            'color: #FF5722;'
          );
          
          // Try scraping method immediately
          const scrapeResponse = await fetch(
            `/api/youtube?action=scrape&username=${cleanUsername}`
          );
          const scrapeData = (await scrapeResponse.json()) as ScrapeResponse;
          if (scrapeData.channelId) {
            setChannelId(scrapeData.channelId);
            setUseFallback(true);
            return;
          }
        }
        
        const channelData = await channelResponse.json() as YouTubeChannelResponse;
        
        // If no channel found, try searching for the channel
        let foundChannelId = channelData.items?.[0]?.id;
        if (!foundChannelId) {
          console.debug(
            '%c⚠️ Channel not found directly. Trying search API...',
            'color: #fbbc05; font-style: italic;'
          );
          
          const searchResponse = await fetch(
            `/api/youtube?action=search&username=${cleanUsername}`
          );
          const searchData = await searchResponse.json() as YouTubeSearchResponse;
          
          const firstItem = searchData.items?.[0];
          foundChannelId = typeof firstItem?.id === 'string' 
            ? firstItem.id 
            : firstItem?.snippet?.channelId || '';
            
          // If still no channel ID, try scraping method
          if (!foundChannelId) {
            console.debug(
              '%c⚠️ Channel not found via API. Trying scrape method...',
              'color: #fbbc05; font-style: italic;'
            );
            
            const scrapeResponse = await fetch(
              `/api/youtube?action=scrape&username=${cleanUsername}`
            );
            const scrapeData = (await scrapeResponse.json()) as ScrapeResponse;
            foundChannelId = scrapeData.channelId ?? '';
          }
        }
        
        if (!foundChannelId) {
          console.debug(
            '%c❌ FAILED: %cCould not find channel ID for %c' + cleanUsername,
            'background: #EA4335; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            'color: #EA4335;',
            'color: white; font-weight: bold;'
          );
          setUseFallback(true);
          return;
        }
        
        // Store the channel ID for fallback use
        setChannelId(foundChannelId);
        
        console.debug(
          '%c✅ SUCCESS: %cFound channel ID: %c' + foundChannelId,
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
          `/api/youtube?action=live&username=${cleanUsername}&channelId=${foundChannelId}`
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
            '%c⚠️ WARNING: %cNo livestream found for channel: %c' + foundChannelId,
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
      if (channelId) {
        console.debug(
          '%c📺 EXPERIMENTAL - DIRECT CHANNEL METHOD %c\n' +
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
          '%cUsing experimental direct channel ID embed method\n' +
          '%cChannel ID: %c' + channelId + '\n' +
          '%cEmbed URL: %c' + fallbackEmbedUrl + '\n' +
          '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'background: #6441a5; color: white; padding: 3px 7px; border-radius: 3px; font-weight: bold;',
          'color: #6441a5;',
          'color: #cccccc;',
          'color: #cccccc;', 'color: #ffffff; font-weight: bold;',
          'color: #cccccc;', 'color: #ffffff; font-style: italic;',
          'color: #6441a5; font-weight: bold;'
        );
      } else {
        console.debug(
          '%c📺 FALLBACK MODE - TRADITIONAL METHOD %c\n' +
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
          '%cUsing traditional user uploads embed method\n' +
          '%cUsername: %c' + cleanUsername + '\n' +
          '%cEmbed URL: %c' + fallbackEmbedUrl + '\n' +
          '%c⚠️ If stream doesn\'t load, please report at: %chttps://github.com/ravier1/adrift/issues\n' +
          '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'background: #FF5722; color: white; padding: 3px 7px; border-radius: 3px; font-weight: bold;',
          'color: #FF5722;',
          'color: #cccccc;',
          'color: #cccccc;', 'color: #ffffff; font-weight: bold;',
          'color: #cccccc;', 'color: #ffffff; font-style: italic;',
          'color: #EA4335;', 'color: #4285f4; text-decoration: underline;',
          'color: #6441a5; font-weight: bold;'
        );
      }
    } else if (videoId) {
      console.debug(
        '%c🎬 YOUTUBE DATA API V3 METHOD %c\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '%cUsing official YouTube Data API v3\n' +
        '%cVideo ID: %c' + videoId + '\n' +
        '%cEmbed URL: %chttps://www.youtube.com/embed/' + videoId + '?autoplay=1\n' +
        '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
        'background: #34A853; color: white; padding: 3px 7px; border-radius: 3px; font-weight: bold;',
        'color: #34A853;',
        'color: #cccccc;',
        'color: #cccccc;', 'color: #ffffff; font-weight: bold;',
        'color: #cccccc;', 'color: #ffffff; font-style: italic;',
        'color: #6441a5; font-weight: bold;'
      );
    }
  }, [useFallback, videoId, channelId, cleanUsername, fallbackEmbedUrl]);

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
