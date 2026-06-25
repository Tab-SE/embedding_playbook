import { NextResponse } from "next/server";
import axios from "axios";
import { jwtSign } from "libs";
import { UserModel } from "@/models";

export const dynamic = 'force-dynamic';

// DEBUG ONLY: mints the embed JWT for a demo user and returns it immediately,
// WITHOUT calling Tableau. So you always see the JWT, even when Tableau
// rejects sign-in. Usage: GET /api/debug-jwt?demo=veriforce&id=a
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const demo = searchParams.get('demo') || 'veriforce';
  const id = searchParams.get('id') || 'a';

  const userModel = new UserModel();
  const user = userModel.getUserById(demo, id);
  if (!user) {
    return NextResponse.json({ error: `user ${id} not found in demo ${demo}` }, { status: 404 });
  }

  const embed_options = {
    jwt_secret: process.env.TABLEAU_EMBED_JWT_SECRET,
    jwt_secret_id: process.env.TABLEAU_EMBED_JWT_SECRET_ID,
    jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID,
  };
  const embed_scopes = [
    "tableau:views:embed",
    "tableau:views:embed_authoring",
    "tableau:insights:embed",
  ];

  // allow overriding the sub (email) to test which identities the site accepts
  const subOverride = searchParams.get('email');
  const sub = subOverride || user.email;

  // mint the embed JWT exactly like the real auth flow does
  const embed_token = jwtSign(sub, embed_options, embed_scopes, user.uaf || {});

  // decode payload for convenience
  let payload = null;
  try {
    const [, payloadB64] = embed_token.split('.');
    payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
  } catch (e) {
    payload = { decodeError: String(e) };
  }

  // Now actually call Tableau's signin with this JWT and capture the RAW result.
  const tableau_domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
  const api = process.env.TABLEAU_API;
  const contentUrl = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
  const endpoint = `${tableau_domain}/api/${api}/auth/signin`;

  let tableau_result;
  try {
    const resp = await axios.post(
      endpoint,
      JSON.stringify({ credentials: { jwt: embed_token, site: { contentUrl } } }),
      { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
    );
    tableau_result = { ok: true, status: resp.status, data: resp.data };
  } catch (err) {
    tableau_result = {
      ok: false,
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,   // <-- Tableau's actual error body
      code: err?.code,
      message: err?.message,
    };
  }

  return NextResponse.json({
    name: user.name,
    email: user.email,
    uaf: user.uaf || {},
    signin_endpoint: endpoint,
    contentUrl,
    embed_token,
    payload,
    tableau_result,
  });
}
