export const runtime = 'edge'; // 'nodejs' is the default
export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { getToken } from 'next-auth/jwt';
import { getInsightBundle } from './libs';

export async function POST(req) {
  // session token specific to each user
  const token = await getToken({ req });

  // Signed in
  if (token?.tableau) {
    // only responds with data to authorized users
    const payload = await makePayload(token.tableau.rest_key, req.body.metric);
    return new Response(`Hello from ${process.env.VERCEL_REGION}`, { status: 201 });
  } else {
    return new Response('401: Unauthorized', { status: 401 });
  }  
};

const makePayload = async (rest_key, metric) => {
  if (rest_key && metric) {
    let bundle;
    try {
      // request insights
      bundle = await getInsightBundle(rest_key, metric, '/detail');
    } catch (err) {
      return err;
    }
    return bundle;
  } else {
    // errors resolve to false
    return new Error('Cannot perform operation without required params');
  }
}
