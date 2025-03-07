/* @ts-expect-error Suppressing ESLint rules for better code readability
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

// src/components/YoutubeStream.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface YoutubeStreamProps {
  username: string;
  onOfflineStatus: (status: boolean) => void;
  onVideoIdChange: (newVideoId: string | null) => void;
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

interface YouTubeChannelDetails {
  items?: Array<{
    snippet?: {
      title?: string;
      thumbnails?: {
        default?: { url: string };
        medium?: { url: string }; // Use medium size for better quality
      };
    };
  }>;
}

interface StreamStatus {
  isOffline: boolean;
  message: string;
  channelName?: string;
  channelId?: string;
  channelAvatar?: string;
}

interface ScrapeResponse {
  channelName: string;
  avatarUrl: string;
}

const YoutubeStream: React.FC<YoutubeStreamProps> = ({ username, onOfflineStatus, onVideoIdChange }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<StreamStatus>({
    isOffline: false,
    message: '',
    channelName: '',
    channelId: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const cleanUsername = username.replace(/^@/, '');
  
  // Fallback embed URL using the old method
  const fallbackEmbedUrl = `https://www.youtube.com/embed?frame=1&listType=user_uploads&list=${cleanUsername}&live=1&autoplay=1`;
  
  useEffect(() => {
    if (!username) return;
    setIsLoading(true); // Start loading
    
    // Cool debug header for the component
    console.debug(
      '%c🚀 Adrift YouTube Stream Loader 🚀\n' +
      '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      `%cLoading stream for: %c${cleanUsername}`,
      'font-size: 14px; font-weight: bold; color: #FF0000; text-shadow: 1px 1px 1px rgba(0,0,0,0.3);',
      'color: #6441a5; font-weight: bold;',
      'color: #cccccc;', 'color: #ffffff; font-weight: bold;'
    );
    
    const fetchChannelInfo = async () => {
      try {
        const response = await fetch(`/api/youtube?action=scrape&username=${cleanUsername}`);
        const data = await response.json() as ScrapeResponse;
        
        if (!data.channelName) {
          // If scraping fails, try using the cleaned username as fallback
          setStreamStatus(prev => ({
            ...prev,
            channelName: cleanUsername,
            isOffline: true,
            message: 'Checking stream status...'
          }));
        } else {
          setStreamStatus(prev => ({
            ...prev,
            channelName: data.channelName,
            channelAvatar: data.avatarUrl
          }));
        }
      } catch (error) {
        console.error('Failed to fetch channel info:', error);
        setStreamStatus(prev => ({
          ...prev,
          channelName: cleanUsername,
          isOffline: true,
          message: 'Checking stream status...'
        }));
      }
    };

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
        let channelName = '';
        if (channelId) {
          try {
            const channelDetailsResponse = await fetch(
              `/api/youtube?action=channelDetails&channelId=${channelId}`
            );
            const channelDetails = await channelDetailsResponse.json() as YouTubeChannelDetails;
            const channelData = channelDetails.items?.[0]?.snippet;
            
            if (channelData) {
              channelName = channelData.title || cleanUsername;
              // Use medium thumbnail for better quality, fallback to default if not available
              const channelAvatar = channelData.thumbnails?.medium?.url || 
                                  channelData.thumbnails?.default?.url;
              
              setStreamStatus(prev => ({ 
                ...prev, 
                channelName, 
                channelId, 
                channelAvatar 
              }));
            }
          } catch (error) {
            console.error('Failed to fetch channel details:', error);
          }
        }
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
        
        if (!liveStreamData.items?.length) {
          // No live stream found - ensure we preserve avatar URL and name
          setStreamStatus(prev => ({ 
            ...prev,
            isOffline: true, 
            message: 'Stream is offline'
          }));
          onOfflineStatus?.(true);
          onVideoIdChange(null);
          return;
        }

        // Found a live stream - continue with normal logic
        const firstItem = liveStreamData.items[0];
        const videoIdObj = firstItem?.id;
        
        const finalVideoId = typeof videoIdObj === 'string' 
          ? videoIdObj
          : videoIdObj && 'videoId' in videoIdObj ? videoIdObj.videoId : null;
            
        if (finalVideoId) {
          setVideoId(finalVideoId);
          setStreamStatus({ isOffline: false, message: '', channelName, channelId });
          onOfflineStatus?.(false);
          onVideoIdChange(finalVideoId);
        } else {
          // Invalid video ID - set offline status
          setStreamStatus({ 
            isOffline: true, 
            message: 'Channel is offline',
            channelName,
            channelId
          });
          onOfflineStatus?.(true);
          onVideoIdChange(null);
        }
      } catch (error) {
        console.error('Stream check failed:', error);
        // On error, preserve any existing channel info
        setStreamStatus(prev => ({ 
          ...prev,
          isOffline: true, 
          message: 'Stream is offline'
        }));
        onOfflineStatus?.(true);
        onVideoIdChange(null);
      }
    };

    // First fetch channel info, then check live status
    const initialize = async () => {
      await fetchChannelInfo();
      await fetchLiveStream();
      setIsLoading(false); // Done loading
      // Update only the message while preserving other state
      setStreamStatus(prev => ({
        ...prev,
        message: 'Stream is offline'
      }));
    };

    initialize().catch(console.error);
  }, [username, cleanUsername, onOfflineStatus, onVideoIdChange]); // Added cleanUsername and onOfflineStatus as dependencies

  // Add new useEffect to handle offline status changes
  useEffect(() => {
    onOfflineStatus?.(streamStatus.isOffline);
  }, [streamStatus.isOffline, onOfflineStatus]);

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#330000] via-[#1a0f26] to-black">
        <div className="flex flex-col items-center gap-8">
          {streamStatus.channelAvatar && (
            <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white/10">
              <Image 
                src={streamStatus.channelAvatar} 
                alt={streamStatus.channelName || cleanUsername} 
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white">
              {streamStatus.channelName || cleanUsername}
            </h1>
            <p className="text-2xl text-white/80">
              Checking stream status...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (streamStatus.isOffline) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#330000] via-[#1a0f26] to-black">
        <div className="flex flex-col items-center gap-8">
          {streamStatus.channelAvatar && (
            <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white/10 shadow-lg shadow-red-500/20">
              <Image 
                src={streamStatus.channelAvatar} 
                alt={streamStatus.channelName || 'Channel'} 
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              {streamStatus.channelName || 'Channel'}
            </h1>
            <p className="text-2xl text-white/80 mb-4">
              is offline 😴
            </p>
            <p className="text-lg text-white/60 italic">
              VOD support is coming soon
            </p>
          </div>
        </div>
      </div>
    );
  }

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

export default YoutubeStream;
