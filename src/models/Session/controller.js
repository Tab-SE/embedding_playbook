import { tabAuthPAT, tabAuthJWT, jwtSign, jwtVerify } from "../../libs";

// calculates the lifespan for the session (estimated)
export const lifespan = (estimatedTimeToExpiration) => {
  // Get the current time in seconds since the epoch
  let created = Math.floor(Date.now() / 1000); 
  // parse the duration string into hours, minutes, and seconds
  const [hours, minutes, seconds] = estimatedTimeToExpiration.split(':').map(Number);
  // calculate the total seconds in the duration
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  // calculate the expiration time in seconds
  const expirationTime = created + totalSeconds;
  // convert the timestamps back to a Date objects
  created = new Date(created * 1000);
  const expirationDate = new Date(expirationTime * 1000);

  return { created: created, expires: expirationDate };
};

// Tableau Embed and REST API authentication via JWT
export const handleJWT = async (sub, jwt_options, scopes, claims) => {
  console.log("claims in handleJWT:", claims)
  // encode and sign new JWTs for Embed and REST APIs
  const embed_token = jwtSign(sub, jwt_options, scopes, claims);
  const rest_token = jwtSign(sub, jwt_options, scopes, claims);
  const { jwt_secret, jwt_client_id } = jwt_options;
  // verify the JWT against the same parameters
  const valid_embed = jwtVerify(embed_token, sub, jwt_secret, jwt_client_id);
  const valid_rest = jwtVerify(rest_token, sub, jwt_secret, jwt_client_id);
  
  if (valid_embed && valid_rest) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWT(rest_token);
    // JWT library automatically calculates session life
    credentials.created = valid_rest.iat;
    credentials.expiration = valid_rest.exp;
    return { credentials, embed_token };
  } else {
    throw new Error('JWT is not valid');
  }
};

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name, pat_secret) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
};
