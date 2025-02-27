import { tabAuthPAT, tabAuthJWT, jwtSign, jwtVerify } from "libs";


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


// Tableau Embed and REST API authentication via JWT
export const handleJWT = async (sub: string, embed_options: JWTOptions, embed_scopes: string[], rest_options: JWTOptions, rest_scopes: string[]) => {
  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, embed_options, embed_scopes);
  const rest_token = jwtSign(sub, rest_options, rest_scopes);
  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, embed_options.jwt_secret, embed_options.jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, rest_options.jwt_secret, rest_options.jwt_client_id);

  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWT(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.exp;
    return { credentials, embed_token };
  } else {
    throw new Error('One or more JWTs are not valid!');
  }
};

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name, pat_secret) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
};
