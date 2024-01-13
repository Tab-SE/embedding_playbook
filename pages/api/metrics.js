import { getToken } from "next-auth/jwt"
import { serverJWT, serverPAT, makeMetrics } from "../../libs";

// handles authentication, HTTP methods and responding with data or errors
const handler = async (req, res) => {
  // session token specific to each user
  const token = await getToken({ req });
  // Signed in
  if (token?.tableau) {
    if (req.method === 'GET') {
      const payload = await makePayload(token.tableau);
      if (payload) {
        res.status(200).json(payload);
      } else {
        // cannot establish a session locally
        res.status(401).json({ error: payload }); 
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } else {
    // Not Signed in
    console.debug('unauthorized');
    // no application token available
    res.status(401).json({ error: 'Unauthorized' }); 
  }
  res.end();
}

export default handler;


// makes the response body for the API
const makePayload = async (tableau) => {
  const { rest_id, rest_key } = tableau;
  if (rest_id && rest_key) {
    // new Metrics model with data obtained using temporary key
    const payload = await makeMetrics(rest_id, rest_key); 
    return payload;
  } else {
    // errors resolve to false when checked
    return new Error('Unauthorized to perform operation');
  }
}


// server-side env vars
const pat_name = process.env.PULSE_PAT_NAME;
const pat_secret = process.env.PULSE_PAT_SECRET;
const jwt_options = { 
  jwt_secret: process.env.TABLEAU_JWT_SECRET, 
  jwt_secret_id: process.env.TABLEAU_JWT_SECRET_ID, 
  jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID, 
};

// establishes REST API authentication with Tableau
const getCredentials = async (token) => {
  // name for session reference, sub for token signing
  const user = {
    name: token.name,
    sub: token.sub,
  };
  // Scopes for Tableau metrics https://help.tableau.com/current/online/en-us/connected_apps_scopes.htm#pulse
  const scopes = [
    'tableau:insight_definitions_metrics:read', 
    'tableau:insight_metrics:read', 
    'tableau:metric_subscriptions:read',
  ];
  // authorize to Tableau via JWT
  // let session = await serverJWT(user, jwt_options, scopes);
  // authorize to Tableau via PAT
  let session = await serverPAT(token.name, pat_name, pat_secret);

  return session;
}
