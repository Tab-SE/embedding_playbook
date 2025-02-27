import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

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
    const { name, demo, email, picture, role, vectors, uaf, tableau } = token;

    // form a payload to safely represent the user on the client
    const clientSafeUser = {
      name,
      demo,
      email,
      picture,
      role,
      vectors,
      uaf,
      embed_token: tableau.embed_token,
      // rest_token: tableau.rest_token, // only for debugging the JWT on the client
      user_id: tableau.user_id,
      site: tableau.site,
      created: tableau.created,
      expires: tableau.expires
    };

    if (clientSafeUser) {
      return NextResponse.json(clientSafeUser, { status: 200 });
    } else {
      return NextResponse.json({ error: '500: Internal error: cannot generate payload' }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });
  }
}
