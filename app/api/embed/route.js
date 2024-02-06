export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// local connected app
export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    if (payload) {
      const embed = token.tableau;
      console.log(embed);
      return NextResponse.json(embed, { status: 200 });
    } else {
      return NextResponse.json({ error: '500: Internal error: cannot generate payload' }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}

