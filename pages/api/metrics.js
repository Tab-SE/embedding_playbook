import { getToken } from "next-auth/jwt"
import { Session, MetricsModel } from "../../models";


const handler = async (req, res) => {
  const token = await getToken({ req });

  console.log('token', token);

  // Signed in
  if (token?.name && token?.sub) {
    if (req.method === 'GET') {
      let sesh;
      try {
        // server-side env vars
        const pat_name = process.env.PULSE_PAT_NAME;
        const pat_secret = process.env.PULSE_PAT_SECRET;
        const jwt_secret = process.env.TABLEAU_JWT_SECRET; 
        const jwt_secret_id = process.env.TABLEAU_JWT_SECRET_ID; 
        const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID; 
        // Scopes for Tableau metrics https://help.tableau.com/current/online/en-us/connected_apps_scopes.htm#pulse
        const scopes = [
          'tableau:insight_definitions_metrics:read', 
          'tableau:insight_metrics:read', 
          'tableau:metric_subscriptions:read',
        ];
        // user provided during authentication is used to create a new Session
        sesh = new Session(token.name);
        // authorize to Tableau via JWT
        await sesh.jwt(token.sub, jwt_secret, jwt_secret_id, jwt_client_id, scopes);
        // authorize to Tableau via PAT
        await sesh.pat(pat_name, pat_secret);
      } catch (err) {
        res.status(500).json({ error: err });
        throw err;
      }
      if (sesh.authorized) {
        // spread members of the Session "sesh"
        const { 
          username, user_id, embed_key, rest_key, site_id, site, created, expires,
        } = sesh;
        // new Metrics model with data obtained using temporary key
        const payload = await getMetrics(user_id, rest_key); 
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

// request metrics
const getMetrics = async (user_id, rest_key) => {
  try {
    // instantiate a new Metrics object for the logged in user
    const factory = new MetricsModel(user_id); 
    // request metrics for the user
    const metrics = await factory.syncMetrics(rest_key); 
    return metrics;
  } catch (err) {
    throw new Error('Metrics Error:', err);
  }
}
