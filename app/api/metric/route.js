export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { makePayload } from './methods';

// responds with a full set of metrics data for generating Pulse Insights
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const specification_id = searchParams.get('specification_id');
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const payload = await makePayload(token.tableau, specification_id);
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