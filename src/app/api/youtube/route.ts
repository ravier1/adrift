import { NextResponse } from "next/server";
import { env } from "~/env";
import axios from 'axios';
import * as cheerio from 'cheerio';

type YouTubeResponse = {
  items?: Array<{
    id: string | { channelId?: string, videoId?: string };
    snippet?: {
      channelId?: string;
    };
  }>;
  error?: {
    message: string;
    code: number;
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  try {
    if (action === "scrape") {
      const response = await axios.get(`https://www.youtube.com/@${username}`);
      const $ = cheerio.load(response.data);
      
      // Get channel name from meta tags
      const channelName = $('meta[property="og:title"]').attr('content');
      
      // Get avatar URL from meta tags or other selectors
      const avatarUrl = $('meta[property="og:image"]').attr('content');
      
      return NextResponse.json({ channelName, avatarUrl });
    }

    if (action === "channel") {
      // Get channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${env.YOUTUBE_API_KEY}`
      );
      const channelData = await channelResponse.json() as YouTubeResponse;
      return NextResponse.json(channelData);
    } else if (action === "search") {
      // Search for channel
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${username}&type=channel&key=${env.YOUTUBE_API_KEY}`
      );
      const searchData = await searchResponse.json() as YouTubeResponse;
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
      const liveStreamData = await liveStreamResponse.json() as YouTubeResponse;
      return NextResponse.json(liveStreamData);
    } else if (action === "channelDetails") {
      const channelId = searchParams.get("channelId");
      if (!channelId) {
        return NextResponse.json({ error: "Channel ID required" }, { status: 400 });
      }
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${env.YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
