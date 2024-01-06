import { tabAuthPAT } from  "../../libs";

// Tableau REST API authentication via Personal Access Token
export const authorizePAT = async (pat_name, pat_secret) => {
  const credentials = { 
    site_id: site_id, 
    site: site, 
    user_id: user_id, 
    rest_key: rest_key, // only REST API key is returned, embed key not supported via PAT
    expiration: expiration 
  }  = await tabAuthPAT(pat_name, pat_secret);

  return credentials;
}