"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [youtubeStreamer, setYoutubeStreamer] = useState("");
  const [twitchStreamer, setTwitchStreamer] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (youtubeStreamer && twitchStreamer) {
      router.push(`/stream?yt=${youtubeStreamer}&tw=${twitchStreamer}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black via-[#392e5c] to-[#6441a5]">
      <form onSubmit={handleSubmit} className="container max-w-md flex flex-col items-center justify-center gap-8 px-8 py-12 mx-4 rounded-3xl bg-black/20 backdrop-blur-md shadow-2xl shadow-purple-500/20 border border-white/10">
        <h1 className="text-6xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">Ad</span>
          <span className="text-[#6441a5] drop-shadow-[0_0_15px_rgba(100,65,165,0.6)]">rift</span>
        </h1>
        
        <div className="flex flex-col gap-6 w-full">
          <input
            type="text"
            placeholder="Enter YouTube Streamer"
            value={youtubeStreamer}
            onChange={(e) => setYoutubeStreamer(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all"
          />
          
          <input
            type="text"
            placeholder="Enter Twitch Streamer"
            value={twitchStreamer}
            onChange={(e) => setTwitchStreamer(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 text-white placeholder-white/40 backdrop-blur-sm border border-white/20 focus:border-white/40 focus:outline-none transition-all"
          />
          
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
  );
}
