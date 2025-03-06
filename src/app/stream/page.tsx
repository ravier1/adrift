"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import YouTubeStream from '~/components/YoutubeStream';
import TwitchChatEmbed from '~/components/TwitchChatEmbed';

const StreamPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StreamContent />
    </Suspense>
  );
};

const StreamContent = () => {
  const searchParams = useSearchParams();
  const youtubeStreamer = searchParams.get('yt') ?? '';
  const twitchStreamer = searchParams.get('tw') ?? '';
  
  return (
    <main className="w-screen h-screen flex flex-row bg-[#18181b]">
      {/* LEFT: Full-height, flexible-width YouTube Stream */}
      <div className="flex-1 h-full">
        <YouTubeStream username={youtubeStreamer} />
      </div>

      {/* RIGHT: Fixed-width Twitch Chat in dark mode */}
      <div className="w-[340px] h-full">
        <TwitchChatEmbed 
          channel={twitchStreamer} 
          parent={process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'} 
        />
      </div>
    </main>
  );
};

export default StreamPage;
