import { getToken } from "next-auth/jwt"
import { MetricsModel, Session } from '../../models'


const handler = async (req, res) => {
  const pat_name = process.env.PULSE_PAT_NAME;
  const pat_secret = process.env.PULSE_PAT_SECRET;
  // get attributes from token for secure server-side processing
  const token = await getToken({ req });

  // Signed in
  if (token.tableau) {
    if (req.method === 'GET') {
      try {
        const sesh = new Session(token.tableau.username); // user provided during authentication is used to create a new Session
        const { name, user_id, rest_key, site_id, site, created, expires,
        } = await sesh.authorizePAT(pat_name, pat_secret); // authorize to Tableau via PAT
        // request metrics
        const metrics = new MetricsModel(user_id); // instantiate a new Metrics object for the logged in user
        const payload = await metrics.syncMetrics(rest_key); // request metrics for the user
        res.status(200).json(payload);
      } catch (err) {
        res.status(500).json({ error: err });
      }
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } else {
    // Not Signed in
    console.debug('unauthorized');
    res.status(401).json({ error: 'Unauthorized' });
  }
  res.end();

}

export default handler;

const getTokens = async (username, pat_name, pat_secret) => {
  const sesh = new Session(username); // user provided during authentication is used to create a new Session
  const { name, user_id, rest_key, site_id, site, created, expires,
  } = await sesh.authorizePAT(pat_name, pat_secret); // authorize to Tableau via PAT

  if (sesh.authorized) {
    // spread members of the Session "sesh"
     return { 
      name, user_id, embed_key, rest_key, site_id, site, created, expires,
    };
  }
}
