import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { makePayload } from './methods';

export const maxDuration = 300; // This function can run for a maximum of 300 seconds
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

// handles authentication, HTTP methods and responding with data or errors
export async function GET(req) {
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const payload = await makePayload(token.tableau);
      if (payload) {
        return NextResponse.json(payload, { status: 200 });
        // return { status: 200, body: payload };
      } else {
        // cannot establish a session locally
        return NextResponse.json({ error: 'Internal error: cannot obtain metrics' }, { status: 500 });
        // return { status: 401, body: { error: 'Unauthorized to perform operation' } };
      }
  } else {
    // Not Signed in
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // return { status: 401, body: { error: 'Unauthorized' } };
  }
}
