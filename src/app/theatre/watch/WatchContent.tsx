"use client";
import { useSearchParams } from "next/navigation";
import PageTransition from "~/components/PageTransition";
import YoutubeTheatre from "~/components/YoutubeTheatre";

export default function WatchContent() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get("v");

  if (!videoId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#2a0000] to-[#ff0000]">
        <div className="text-white text-2xl">No video ID provided</div>
      </div>
    );
  }

  return (
    <PageTransition transitionType="red">
      <div className="relative w-full h-screen">
        <YoutubeTheatre videoId={videoId} />
      </div>
    </PageTransition>
  );
}
