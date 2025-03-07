"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import YoutubeStream from '~/components/YoutubeStream';
import TwitchChatEmbed from '~/components/TwitchChatEmbed';
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
  const [isStreamOffline, setIsStreamOffline] = useState(true); // Start with true to hide chat initially
  const [videoId, setVideoId] = useState<string | null>(null);
  
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

      {/* Only show Twitch chat if stream is confirmed online */}
      {!isStreamOffline && videoId && twitchStreamer && (
        <div className="h-[60vh] w-full landscape:w-[340px] landscape:h-full">
          <TwitchChatEmbed 
            channel={twitchStreamer} 
            parent={process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'} 
          />
        </div>
      )}
    </main>
  );
};

export default StreamPage;
