"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageTransition from "~/components/PageTransition";
import FloatingButton from "~/components/FloatingButton";

interface ChannelInfo {
  avatar: string | null;
  channelName: string | null;
}

interface ScrapeResponse {
  avatar: string | null;
  channelName: string | null;
  error?: string;
}

export default function HomePage() {
  const [youtubeStreamer, setYoutubeStreamer] = useState("");
  const [twitchStreamer, setTwitchStreamer] = useState("");
  const [channelInfo, setChannelInfo] = useState<ChannelInfo | null>(null);
  const [showCopyAnimation, setShowCopyAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchChannelInfo = async () => {
      const cleanUsername = youtubeStreamer.replace(/^@/, '');
      
      if (cleanUsername.length < 2) {
        setShowCopyAnimation(false);
        setTimeout(() => setChannelInfo(null), 500);
        return;
      }

      try {
        const response = await fetch(`/api/youtube?action=scrape&username=${cleanUsername}`);
        const data = await response.json() as ScrapeResponse;
        
        if (data.avatar || data.channelName) {
          setShowCopyAnimation(false);
          setTimeout(() => {
            setChannelInfo({
              avatar: data.avatar,
              channelName: data.channelName
            });
            setShowCopyAnimation(true);
          }, 300);
        }
      } catch (error) {
        console.error('Failed to fetch channel info:', error);
      }
    };

    // Create a wrapper function to handle the Promise
    const handleFetch = () => {
      void fetchChannelInfo();
    };

    handleFetch();
    const timeoutId = setTimeout(handleFetch, 500);
    return () => clearTimeout(timeoutId);
  }, [youtubeStreamer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeStreamer && twitchStreamer) {
      // Remove @ from both usernames if present and add @ only for YouTube
      const cleanYoutubeUser = youtubeStreamer.replace(/^@/, '');
      const cleanTwitchUser = twitchStreamer.replace(/^@/, '');
      router.push(`/stream?yt=@${cleanYoutubeUser}&tw=${cleanTwitchUser}`);
    }
  };

  const handleCopy = () => {
    // Remove @ when copying from YouTube to Twitch
    setTwitchStreamer(youtubeStreamer.replace(/^@/, ''));
  };

  return (
    <PageTransition transitionType="purple">
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-[#392e5c] to-[#6441a5]">
        <form onSubmit={handleSubmit} className="container max-w-md flex flex-col items-center justify-center gap-8 px-8 py-12 mx-4 rounded-3xl bg-black/20 backdrop-blur-md shadow-2xl shadow-purple-500/20 border border-white/10">
          <h1 className="text-6xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Ad</span>
            <span className="text-[#6441a5] drop-shadow-[0_0_15px_rgba(100,65,165,0.6)]">rift</span>
          </h1>
          
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col items-center gap-4">
              <div className="h-[140px] flex items-center justify-center">
                {channelInfo?.avatar && (
                  <div className={`flex flex-col items-center transition-all duration-300 ${
                    showCopyAnimation ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                  }`}>
                    <div className="relative w-24 h-24 mb-3 animate-float">
                      <Image
                        src={channelInfo.avatar}
                        alt="Channel Avatar"
                        fill
                        className="rounded-full object-cover border-2 border-white/20 shadow-lg"
                        unoptimized // YouTube avatars are already optimized
                      />
                    </div>
                    {channelInfo.channelName && (
                      <span className="text-white/90 text-lg font-medium">
                        {channelInfo.channelName}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <input
                  type="text"
                  placeholder="Enter YouTube username (without @)"
                  value={youtubeStreamer}
                  onChange={(e) => setYoutubeStreamer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all"
                />
                <span className="text-white/50 text-sm px-1">For YouTube stream source</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleCopy}
              className="self-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
            >
               Copy the same username ⇣
            </button>

            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Enter Twitch username"
                value={twitchStreamer}
                onChange={(e) => setTwitchStreamer(e.target.value.replace(/^@/, ''))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all"
              />
              <span className="text-white/50 text-sm px-1">For Twitch chat integration</span>
            </div>
            
            <button
              type="submit"
              className="group relative w-full px-8 py-4 rounded-xl bg-gradient-to-r from-white/10 to-[#6441a5]/80 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 border border-white/20"
            >
              Jump In 
              <span className="ml-2 inline-block group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                🚀
              </span>
              <span className="absolute -z-10 inset-0 blur-xl bg-gradient-to-r from-white/20 to-[#6441a5] opacity-50 group-hover:opacity-75 transition-opacity rounded-xl"></span>
            </button>
          </div>
        </form>

        <FloatingButton 
          href="https://github.com/ravier1/"
          className="bottom-4 left-4 group"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span className="max-w-0 overflow-hidden transition-all duration-300 group-hover:max-w-xs whitespace-nowrap">
              ravier1
            </span>
          </span>
        </FloatingButton>

        <FloatingButton 
          href="https://ko-fi.com/ravier1"
          className="bottom-4 right-4"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1.646-7.646-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708z"/>
            </svg>
            <span className="font-bold">Donate</span>
          </span>
        </FloatingButton>

      </main>
    </PageTransition>
  );
}
