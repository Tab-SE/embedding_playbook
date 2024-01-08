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
export const handleJWT = async (sub, jwt_secret, jwt_secret_id, jwt_client_id, scopes) => {
  // first encode a new JWT
  const jwt = jwtSign(sub, jwt_secret, jwt_secret_id, jwt_client_id, scopes);
  // then verify the JWT against the same parameters
  const valid = jwtVerify(jwt, sub, jwt_secret, jwt_client_id);
  if (valid) {
    // only return credentials if JWT meets requirements
    const credentials = await tabAuthJWT(jwt);
    // JWT library automatically calculates session life
    credentials.created = valid.iat;
    credentials.expiration = valid.exp;
    return credentials;
  } else {
    throw new Error('JWT is not valid');
  }
};

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name, pat_secret) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
};
