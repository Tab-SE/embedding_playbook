import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Constants
export const maxDuration = 60; // 60 is the hobby limit. 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic'; // Ensures dynamic response based on the incoming request

// Utility to fetch and forward Google Fonts
async function fetchGoogleFont(fontName: string, weight: string) {
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@${weight}&display=swap`;

  const response = await fetch(googleFontsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch Google Font: ${response.statusText}`);
  }

  return response.text(); // Return the CSS content
}

// Handles POST requests for font proxying
export async function POST(req) {
  if (!req) {
    const msg = '400: Bad Request';
    console.debug(msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Verify the user's token via next-auth
  const token = await getToken({ req });
  if (!token) {
    const msg = '401: Unauthorized';
    console.debug(msg);
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fontName, weight = '400' } = body;

    if (!fontName) {
      const msg = '400: Missing fontName in request body';
      console.debug(msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Fetch the font content via Google Fonts
    const fontCss = await fetchGoogleFont(fontName, weight);

    return new NextResponse(fontCss, {
      status: 200,
      headers: { 'Content-Type': 'text/css' },
    });
  } catch (error) {
    const msg = `500: Internal error: ${error.message}`;
    console.debug(msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
