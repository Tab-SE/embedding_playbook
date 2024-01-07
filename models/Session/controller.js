import { tabAuthPAT } from "../../libs";

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

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name, pat_secret) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
}

// Tableau Embed and REST API authentication via JWT
export const handleJWT = async (pat_name, pat_secret) => {
  const credentials = await tabAuthPAT(pat_name, pat_secret);
  return credentials;
}
