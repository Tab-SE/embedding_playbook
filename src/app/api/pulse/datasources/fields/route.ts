export const dynamic = 'force-dynamic'; // static by default, unless reading the request

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { makePayload } from './methods';
import { field } from "vega";

// responds with a full set of data source data for filtering Pulse metrics
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const datasourceId = searchParams.get('datasourceId');
  const fieldName = searchParams.get('fieldName');
 
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
  if (token?.tableau && fieldName) {
    const payload = await makePayload(token.tableau, datasourceId, fieldName);
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
