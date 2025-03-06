"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageTransition from "~/components/PageTransition";

export default function HomePage() {
  const [youtubeStreamer, setYoutubeStreamer] = useState("");
  const [twitchStreamer, setTwitchStreamer] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeStreamer && twitchStreamer) {
      router.push(`/stream?yt=@${youtubeStreamer}&tw=${twitchStreamer}`);
    }
  };

  const handleCopy = () => {
    setTwitchStreamer(youtubeStreamer);
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
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Enter YouTube username (without @)"
                value={youtubeStreamer}
                onChange={(e) => setYoutubeStreamer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all"
              />
              <span className="text-white/50 text-sm px-1">For YouTube stream source</span>
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
                onChange={(e) => setTwitchStreamer(e.target.value)}
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
      </main>
    </PageTransition>
  );
}
