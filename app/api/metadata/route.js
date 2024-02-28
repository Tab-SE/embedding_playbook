export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getMetadata } from './methods';

// local connected app
export async function GET(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const payload = await getMetadata(token.tableau.rest_key);
    if (payload) {
      return NextResponse.json(payload, { status: 200 });
    } else {
      return NextResponse.json({ error: '500: Internal error: cannot generate payload' }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}
