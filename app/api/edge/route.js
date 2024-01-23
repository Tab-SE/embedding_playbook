export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { getToken } from "next-auth/jwt";

export async function GET(req) {
  // session token specific to each user
  const token = await getToken({ req });

  // Signed in
  if (token?.tableau) {
    return new Response(`Hello from ${process.env.VERCEL_REGION}`);
  } else {
    return new Response('401: Unauthorized');
  }  
};
