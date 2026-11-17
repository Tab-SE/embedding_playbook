// Server-only: reads the Tableau site's "AI in Tableau" settings from the REST API
// (GET /sites/{id} → generativeAi* attributes). Needs tableau:sites:read, which the
// sign-in REST token doesn't carry, so this mints a short-lived Connected App JWT
// for the given user with just that scope.
import { jwtSign } from "@/libs/crypto";

const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN;
const site = process.env.NEXT_PUBLIC_ANALYTICS_SITE;
const apiVersion = '3.24';

// Short in-memory cache so every page load / chat message doesn't sign in to Tableau.
const CACHE_MS = 60 * 1000;
let cache = { at: 0, flags: null };

const fetchSiteAiFlags = async (email) => {
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

export const getSiteAiFlags = async (email) => {
  if (!cache.flags || Date.now() - cache.at > CACHE_MS) {
    cache = { at: Date.now(), flags: await fetchSiteAiFlags(email) };
  }
  return cache.flags;
};

// "AI is on for the site" = any of the AI in Tableau settings is on.
export const isSiteAiOn = (flags) => !!flags && Object.values(flags).some((v) => v === true);
