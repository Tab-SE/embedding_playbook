export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { makePayload } from './methods';

// responds with a full set of data source data for filtering Pulse metrics
export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const datasourceId = searchParams.get('datasourceId');

  // Extract extension_options from request body
  // const body = await req.json();

  // Check if req is defined
  if (!req) {
    return NextResponse.json({ error: '400: Bad Request' }, { status: 400 });
  }
  // session token specific to each user
  const token = await getToken({ req });

  if (!datasourceId) {
    return NextResponse.json({ error: 'DatasourceIds are required' }, { status: 400 });
  }

  // Check if token is defined
  if (token?.tableau) {
    const payload = await makePayload(token.tableau, datasourceId);
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
