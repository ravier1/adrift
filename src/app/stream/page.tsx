"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import YouTubeStream from '~/components/YoutubeStream';
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
  
  return (
    <main className="w-screen h-screen flex flex-col landscape:flex-row bg-[#18181b] divide-0 overflow-hidden">
      {/* YouTube Stream - Full width on portrait, flexible width on landscape */}
      <div className="h-[40vh] landscape:h-full landscape:flex-1 portrait:tablet:h-[60vh] flex">
        <YouTubeStream username={youtubeStreamer} />
      </div>

      {/* Twitch Chat - Fixed dimensions, only height is flexible in portrait */}
      <div className="h-[60vh] w-full landscape:w-[340px] landscape:h-full flex">
        <TwitchChatEmbed 
          channel={twitchStreamer} 
          parent={process.env.NEXT_PUBLIC_DOMAIN ?? 'localhost'} 
        />
      </div>
    </main>
  );
};

export default StreamPage;
