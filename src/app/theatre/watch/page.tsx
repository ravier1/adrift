"use client";
import { Suspense } from "react";
import WatchContent from "./WatchContent";

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-[#2a0000] to-[#ff0000]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <WatchContent />
    </Suspense>
  );
}
