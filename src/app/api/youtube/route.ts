import { NextResponse } from "next/server";
import { env } from "~/env";
import { youtubeRateLimiter } from "~/utils/rateLimiter";

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

  // Check rate limit before making any API calls
  if (!await youtubeRateLimiter.checkLimit()) {
    console.warn("YouTube API rate limit exceeded");
    return NextResponse.json(
      { error: "Rate limit exceeded. Try using channel ID method." },
      { status: 429 }
    );
  }

  try {
    // Check if the API response indicates quota exceeded
    const checkQuota = async (response: Response) => {
      const data = await response.json() as YouTubeResponse;
      if (data.error?.code === 403 && data.error?.message?.includes('quotaExceeded')) {
        console.debug(
          '\n' +
          '%c🚨 YOUTUBE API QUOTA EXCEEDED 🚨\n' +
          '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
          '%cDaily limit reached for YouTube Data API v3\n' +
          '%cStatus: %c403 Quota Exceeded\n' +
          '%cMessage: %c' + data.error.message + '\n' +
          '%c\nFalling back to experimental channel ID method...\n' +
          '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'font-size: 14px; font-weight: bold; color: #EA4335; text-shadow: 1px 1px 1px rgba(0,0,0,0.3);',
          'color: #EA4335; font-weight: bold;',
          'color: #cccccc;',
          'color: #cccccc;', 'color: #EA4335; font-weight: bold;',
          'color: #cccccc;', 'color: #ffffff; font-style: italic;',
          'color: #6441a5; font-style: italic;',
          'color: #EA4335; font-weight: bold;'
        );
        return true;
      }
      return false;
    };

    if (action === "scrape") {
      // Scrape channel ID and avatar from YouTube page
      const response = await fetch(`https://www.youtube.com/@${username}`);
      const html = await response.text();
      
      // Find the canonical link using RegExp.exec()
      const channelRegex = /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})">/;
      const match = channelRegex.exec(html);

      // Find the avatar URL and channel name
      const avatarRegex = /<meta property="og:image" content="([^"]+)">/;
      const nameRegex = /<meta property="og:title" content="([^"]+)">/;
      
      const avatarMatch = avatarRegex.exec(html);
      const nameMatch = nameRegex.exec(html);
      
      if (!match?.[1]) {
        return NextResponse.json({ error: "Channel ID not found" }, { status: 404 });
      }
      
      return NextResponse.json({ 
        channelId: match[1],
        avatar: avatarMatch?.[1] ?? null,
        channelName: nameMatch?.[1] ?? null
      });
    }

    if (action === "channel") {
      // Get channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${env.YOUTUBE_API_KEY}`
      );
      
      // Clone the response as it will be consumed by checkQuota
      const responseClone = channelResponse.clone();
      if (await checkQuota(responseClone)) {
        return NextResponse.json({ error: "Quota exceeded" }, { status: 429 });
      }
      
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
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("YouTube API error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
