export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { getToken } from 'next-auth/jwt';
import { makePayload } from './methods';

export async function POST(req) {
  // Check if req is defined
  if (!req) {
    return new Response('Bad Request', { status: 400 });
  }

  // session token specific to each user
  const token = await getToken({ req });

  // Check if token is defined
  if (token?.tableau) {
    const requestBody = await req.json();
    // only responds with data to authorized users
    const payload = await makePayload(token.tableau.rest_key, requestBody.metric);
    return new Response(payload, { status: 201 });
  } else {
    return new Response('401: Unauthorized', { status: 401 });
  }  
};
