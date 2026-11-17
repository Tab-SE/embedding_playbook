export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtSign } from "@/libs/crypto";

const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
const apiVersion = '3.24';

// Short in-memory cache so every page load doesn't sign in to Tableau.
const CACHE_MS = 60 * 1000;
let cache = { at: 0, flags: null };

// Reads the site's "AI in Tableau" settings from the REST API
// (GET /sites/{id} → generativeAi* attributes). Needs tableau:sites:read, which
// the sign-in REST token doesn't carry, so mint a short-lived Connected App JWT
// for the signed-in user with just that scope.
const readSiteAiFlags = async (email) => {
  const jwt = jwtSign(email, {
    jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID,
    jwt_secret_id: process.env.TABLEAU_REST_JWT_SECRET_ID,
    jwt_secret: process.env.TABLEAU_REST_JWT_SECRET,
  }, ['tableau:sites:read'], {});

  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
  const signin = await fetch(`${domain}/api/${apiVersion}/auth/signin`, {
    method: 'POST', headers, cache: 'no-store',
    body: JSON.stringify({ credentials: { jwt, site: { contentUrl: site } } }),
  });
  if (!signin.ok) throw new Error(`signin ${signin.status}`);
  const { credentials } = await signin.json();
  const auth = { ...headers, 'X-Tableau-Auth': credentials.token };

  try {
    const res = await fetch(`${domain}/api/${apiVersion}/sites/${credentials.site.id}`, { headers: auth, cache: 'no-store' });
    if (!res.ok) throw new Error(`GET site ${res.status}`);
    const { site: s } = await res.json();
    return {
      generativeAiWebAuthoring: s.generativeAiWebAuthoring === true,
      generativeAiPulse: s.generativeAiPulse === true,
      generativeAiDataCatalog: s.generativeAiDataCatalog === true,
      generativeAiPrep: s.generativeAiPrep === true,
    };
  } finally {
    fetch(`${domain}/api/${apiVersion}/auth/signout`, { method: 'POST', headers: auth }).catch(() => {});
  }
};

export async function GET(req) {
  const token = await getToken({ req });
  if (!token?.email) return NextResponse.json({ error: '401: Unauthorized' }, { status: 401 });

  try {
    if (!cache.flags || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), flags: await readSiteAiFlags(token.email) };
    }
    return NextResponse.json(cache.flags);
  } catch (err) {
    console.error('[site-ai]', err.message);
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
