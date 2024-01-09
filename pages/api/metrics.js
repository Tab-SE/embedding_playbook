import { getToken } from "next-auth/jwt"
import { serverJWT, serverPAT, makeMetrics } from "../../libs";


const handler = async (req, res) => {
  const token = await getToken({ req });
  // Signed in
  if (token?.name && token?.sub) {
    if (req.method === 'GET') {
      // session object
      let sesh; 
      try {
        // server-side env vars
        const pat_name = process.env.PULSE_PAT_NAME;
        const pat_secret = process.env.PULSE_PAT_SECRET;
        const jwt_options = { 
          jwt_secret: process.env.TABLEAU_JWT_SECRET, 
          jwt_secret_id: process.env.TABLEAU_JWT_SECRET_ID, 
          jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID, 
        };
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
        sesh = await serverJWT(user, jwt_options, scopes);
        // authorize to Tableau via PAT
        sesh = await serverPAT(user.name, pat_name, pat_secret);
      } catch (err) {
        res.status(500).json({ error: err });
        throw err;
      }
      if (sesh.authorized) {
        // spread members of the Session "sesh"
        const { 
          username, user_id, embed_token, rest_key, site_id, site, created, expires,
        } = sesh;
        // new Metrics model with data obtained using temporary key
        const payload = await makeMetrics(user_id, rest_key); 
        res.status(200).json(payload);
      } else {
        // cannot establish a session locally
        res.status(401).json({ error: 'Unauthorized to perform operation' }); 
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

const getCredentials = async (token) => {
  // server-side env vars
  const pat_name = process.env.PULSE_PAT_NAME;
  const pat_secret = process.env.PULSE_PAT_SECRET;
  const jwt_options = { 
    jwt_secret: process.env.TABLEAU_JWT_SECRET, 
    jwt_secret_id: process.env.TABLEAU_JWT_SECRET_ID, 
    jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID, 
  };
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
  sesh = await serverJWT(user, jwt_options, scopes);
  // authorize to Tableau via PAT
  sesh = await serverPAT(user.name, pat_name, pat_secret);

  return sesh;
}

