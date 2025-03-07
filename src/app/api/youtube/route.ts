import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    if (action === "channel") {
      // Get channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${env.YOUTUBE_API_KEY}`
      );
      const channelData = await channelResponse.json();
      return NextResponse.json(channelData);
    } else if (action === "search") {
      // Search for channel
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${username}&type=channel&key=${env.YOUTUBE_API_KEY}`
      );
      const searchData = await searchResponse.json();
      return NextResponse.json(searchData);
    } else if (action === "live") {
      // Get live stream
      const channelId = searchParams.get("channelId");
      if (!channelId) {
        return NextResponse.json({ error: "Channel ID is required" }, { status: 400 });
      }
      const liveStreamResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${env.YOUTUBE_API_KEY}`
      );
      const liveStreamData = await liveStreamResponse.json();
      return NextResponse.json(liveStreamData);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
