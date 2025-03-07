import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET() {
  try {
    const scope = 'https://www.googleapis.com/auth/youtube.force-ssl';
    const redirectUri = `${env.PUBLIC_URL}/api/youtube/auth/callback`; // Use server-side env
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline`;

    // Instead of returning JSON, redirect directly to Google's auth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect('/theatre?error=auth_failed');
  }
}
