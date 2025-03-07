"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import YoutubeStream from '~/components/YoutubeStream';
import TwitchChatEmbed from '~/components/TwitchChatEmbed';
import YoutubeChatEmbed from '~/components/YoutubeChatEmbed';
import PageTransition from "~/components/PageTransition";

const StreamPage = () => {
  return (
    <PageTransition>
      <Suspense fallback={<div>Loading...</div>}>
        <StreamContent />
      </Suspense>
    </PageTransition>
  );
};

const StreamContent = () => {
  const searchParams = useSearchParams();
  const youtubeStreamer = searchParams.get('yt') ?? '';
  const twitchStreamer = searchParams.get('tw') ?? '';
  const [isStreamOffline, setIsStreamOffline] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'twitch' | 'youtube'>('twitch');
  
  const handleStreamOffline = (status: boolean) => {
    setIsStreamOffline(status);
  };

  const handleVideoIdChange = (newVideoId: string | null) => {
    setVideoId(newVideoId);
  };
  
  return (
    <main className="w-screen h-screen flex flex-col landscape:flex-row bg-[#18181b] divide-0 overflow-hidden">
      <div className="h-full w-full flex">
        <YoutubeStream 
          username={youtubeStreamer} 
          onOfflineStatus={handleStreamOffline}
          onVideoIdChange={handleVideoIdChange}
        />
      </div>

      {!isStreamOffline && (
        <div className="h-[60vh] w-full landscape:w-[340px] landscape:h-full flex flex-col">
          <div className="flex justify-center items-center gap-2 p-2 bg-white/5">
            <button
              onClick={() => setChatType('twitch')}
              className={`px-3 py-1 rounded ${
                chatType === 'twitch' ? 'bg-[#6441a5] text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              Twitch
            </button>
            <button
              onClick={() => setChatType('youtube')}
              className={`px-3 py-1 rounded ${
                chatType === 'youtube' ? 'bg-[#ff0000] text-white' : 'bg-white/10 text-white/60'
              }`}
            >
              YouTube
            </button>
          </div>
          <div className="flex-1">
            {chatType === 'twitch' ? (
              <TwitchChatEmbed 
                channel={twitchStreamer} 
                parent={process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'} 
              />
            ) : (
              <YoutubeChatEmbed videoId={videoId} />
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default StreamPage;
