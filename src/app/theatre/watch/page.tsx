"use client";
import { useSearchParams } from "next/navigation";
import PageTransition from "~/components/PageTransition";
import YoutubeTheatre from "~/components/YoutubeTheatre";

export default function TheatreWatchPage() {
  const searchParams = useSearchParams();
  const videoId = searchParams.get('v') ?? '';

  return (
    <PageTransition transitionType="red">
      <main className="w-screen h-screen flex bg-black overflow-hidden">
        <YoutubeTheatre videoId={videoId} />
      </main>
    </PageTransition>
  );
}
