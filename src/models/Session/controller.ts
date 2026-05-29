import { tabAuthPAT, tabAuthJWT, tabAuthJWTEACanada, tabAuthJWTUBL, jwtSign, jwtVerify } from "libs";

export interface UAF {
  [key: string]: string[];
}

export interface JWTOptions {
  jwt_secret?: string;
  jwt_secret_id?: string;
  jwt_client_id?: string;
}

// calculates the lifespan for the session (estimated)
export const lifespan = (estimatedTimeToExpiration: number) => {
  // Get the current time as a Date object
  const created = new Date();
  // Calculate the expiration time
  const expires = new Date(estimatedTimeToExpiration * 1000);

  return { created, expires };
};

// Tableau REST API session cookie lifetime after JWT redemption.
// JWT itself is only valid for 9-10 min (redemption window), but the resulting
// REST session is good for ~2 hours. Track the REST session lifetime, not the JWT's,
// so refresh isn't triggered by the short-lived JWT exp.
const REST_SESSION_LIFETIME_SECONDS = 2 * 60 * 60;


// Tableau Embed and REST API authentication via JWT
export const handleJWT = async (
  sub: string,
  embed_options: JWTOptions,
  embed_scopes: string[],
  rest_options: JWTOptions,
  rest_scopes: string[],
  uaf: UAF
) => {
  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, embed_options, embed_scopes, uaf);
  const rest_token = jwtSign(sub, rest_options, rest_scopes, uaf);
  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, embed_options.jwt_secret, embed_options.jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, rest_options.jwt_secret, rest_options.jwt_client_id);

  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWT(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.iat + REST_SESSION_LIFETIME_SECONDS;

    return { credentials, rest_token,  embed_token };
  } else {
    throw new Error('One or more JWTs are not valid!');
  }
};

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name: string, pat_secret: string) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
};

// EACanada Tableau Embed and REST API authentication via JWT
export const handleJWTEACanada = async (
  sub: string,
  embed_options: JWTOptions,
  embed_scopes: string[],
  rest_options: JWTOptions,
  rest_scopes: string[],
  uaf: UAF
) => {
  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, embed_options, embed_scopes, uaf);
  const rest_token = jwtSign(sub, rest_options, rest_scopes, uaf);
  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, embed_options.jwt_secret, embed_options.jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, rest_options.jwt_secret, rest_options.jwt_client_id);

  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWTEACanada(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.iat + REST_SESSION_LIFETIME_SECONDS;

    return { credentials, rest_token,  embed_token };
  } else {
    throw new Error('One or more JWTs are not valid!');
  }
};

// UBL Tableau Embed and REST API authentication via JWT
// extraClaims lets us inject UBL-specific JWT claims (e.g. ODA: `https://tableau.com/oda`,
// `https://tableau.com/groups`) without affecting the other connected apps.
export const handleJWTUBL = async (
  sub: string,
  embed_options: JWTOptions,
  embed_scopes: string[],
  rest_options: JWTOptions,
  rest_scopes: string[],
  uaf: UAF,
  extraClaims: Record<string, unknown> = {}
) => {
  // merge UAF + extra claims (UAF wins on key collision, since UAF carries explicit RLS)
  const claims = { ...extraClaims, ...uaf };
  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, embed_options, embed_scopes, claims);
  const rest_token = jwtSign(sub, rest_options, rest_scopes, claims);

  // Debug log: print signed JWTs with cmd+click-able jwt.io URLs (most macOS terminals
  // make these clickable). The embed token is what's sent with the viz; the rest token
  // is redeemed against /auth/signin. Use jwt.io to inspect claims for RLS/UAF debugging.
  console.log(`[handleJWTUBL] sub=${sub}`);
  console.log(`[handleJWTUBL] embed jwt:  https://jwt.io/?token=${embed_token}`);
  console.log(`[handleJWTUBL] rest  jwt:  https://jwt.io/?token=${rest_token}`);
  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, embed_options.jwt_secret, embed_options.jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, rest_options.jwt_secret, rest_options.jwt_client_id);

  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWTUBL(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.iat + REST_SESSION_LIFETIME_SECONDS;

    return { credentials, rest_token,  embed_token };
  } else {
    throw new Error('One or more JWTs are not valid!');
  }
};
