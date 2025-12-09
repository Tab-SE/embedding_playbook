import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

// eacanada connected app
export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau_eacanada) {
    const { name, demo, email, picture, role, vectors, uaf, tableau_eacanada } = token;

    // form a payload to safely represent the user on the client
    const clientSafeUser = {
      name,
      demo,
      email,
      picture,
      role,
      vectors,
      uaf,
      embed_token: tableau_eacanada.embed_token,
      // rest_token: tableau_eacanada.rest_token, // only for debugging the JWT on the client
      user_id: tableau_eacanada.user_id,
      site: tableau_eacanada.site,
      created: tableau_eacanada.created,
      expires: tableau_eacanada.expires
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

