import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("yt_access_token");

  if (!accessToken) {
    return new Response(null, { status: 401 });
  }

  try {
    // Validate token with Google
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + accessToken.value
    );

    if (!response.ok) {
      return new Response(null, { status: 401 });
    }

    // Return the access token along with auth status
    return NextResponse.json({ 
      authenticated: true,
      accessToken: accessToken.value
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return new Response(null, { status: 401 });
  }
}
