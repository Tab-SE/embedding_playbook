export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getSiteAiFlags, isSiteAiOn } from "@/libs/server/siteAi";

// Returns the Tableau site's "AI in Tableau" settings plus an overall `anyOn`.
export async function GET(req) {
  const token = await getToken({ req });
  if (!token?.email) return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });

  try {
    const flags = await getSiteAiFlags(token.email);
    return NextResponse.json({ ...flags, anyOn: isSiteAiOn(flags) });
  } catch (err) {
    console.error('[site-ai]', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
