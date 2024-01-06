import { tabAuthPAT } from "../../libs";

// Tableau REST API authentication via Personal Access Token
export const handlePAT = async (pat_name, pat_secret) => {
  console('authorizePAT', pat_name, pat_secret);
  const credentials = await tabAuthPAT(pat_name, pat_secret);

  console('authorizePAT', credentials);
  return credentials;
}
