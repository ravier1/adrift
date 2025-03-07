"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import YouTubeStream from "~/components/YoutubeStream";
import TwitchChatEmbed from "~/components/TwitchChatEmbed";
import FloatingButton from "~/components/FloatingButton";
import PageTransition from "~/components/PageTransition";
import { env } from "~/env";

// Loading component for Suspense fallback
const LoadingState = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <div className="text-white text-center animate-pulse">
      Loading stream...
    </div>
  </div>
);

// Main stream content component that uses useSearchParams
const StreamContent = () => {
  const searchParams = useSearchParams();
  const youtubeStreamer = searchParams?.get('yt') ?? '';
  const twitchStreamer = searchParams?.get('tw') ?? '';

  if (!youtubeStreamer || !twitchStreamer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Missing stream parameters</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <div className="flex-grow">
        <YouTubeStream username={youtubeStreamer} />
      </div>
      <div className="w-96 border-l border-white/10">
        <TwitchChatEmbed 
          channel={twitchStreamer} 
          parent={env.NEXT_PUBLIC_DOMAIN}
        />
      </div>
      <FloatingButton 
        href="/"
        className="top-4 right-4 z-50"
      >
        <span className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          <span>Back</span>
        </span>
      </FloatingButton>
    </div>
  );
};

// Main page component with proper nesting of Suspense and PageTransition
export default function StreamPage() {
  return (
    <PageTransition transitionType="purple">
      <Suspense fallback={<LoadingState />}>
        <StreamContent />
      </Suspense>
    </PageTransition>
  );
}
