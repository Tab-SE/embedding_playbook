import { tabAuthPAT, tabAuthJWT, jwtSign, jwtVerify } from "libs";

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


// Tableau Embed and REST API authentication via JWT
export const handleJWT = async (
  sub: string,
  embed_options: JWTOptions,
  embed_scopes: string[],
  rest_options: JWTOptions,
  rest_scopes: string[],
  uaf: UAF
) => {
  console.log('🔑 JWT Generation Debug:');
  console.log('Subject (sub):', sub);
  console.log('Embed Options:', embed_options);
  console.log('Embed Scopes:', embed_scopes);
  console.log('Rest Options:', rest_options);
  console.log('Rest Scopes:', rest_scopes);
  console.log('UAF:', uaf);

  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, embed_options, embed_scopes, uaf);
  const rest_token = jwtSign(sub, rest_options, rest_scopes, uaf);

  console.log('Generated Embed Token:', embed_token);
  console.log('Generated Rest Token:', rest_token);

  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, embed_options.jwt_secret, embed_options.jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, rest_options.jwt_secret, rest_options.jwt_client_id);

  console.log('Embed Token Valid:', valid_embed);
  console.log('Rest Token Valid:', valid_rest);

  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    console.log('🚀 Attempting Tableau authentication with REST token...');
    const credentials = await tabAuthJWT(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.exp;

    console.log('✅ JWT Authentication successful!');
    return { credentials, rest_token,  embed_token };
  } else {
    console.error('❌ JWT validation failed!');
    throw new Error('One or more JWTs are not valid!');
  }
};

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name: string, pat_secret: string) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
};
