import { getToken } from "next-auth/jwt"
import { Session, MetricsModel } from "../../models";


const handler = async (req, res) => {
  const pat_name = process.env.PULSE_PAT_NAME;
  const pat_secret = process.env.PULSE_PAT_SECRET;
  // get attributes from token for secure server-side processing
  const token = await getToken({ req });

  // Signed in
  if (token?.tableau) { // tableau object containing asset data for the user
    if (req.method === 'GET') {
      let sesh;
      try {
        sesh = new Session(token.tableau.username); // user provided during authentication is used to create a new Session
        // const { username, user_id, rest_key, site_id, site, created, expires,
        // } = await sesh.pat(pat_name, pat_secret); // authorize to Tableau via PAT
        // console.log(username, user_id, rest_key);
        await sesh.pat(pat_name, pat_secret); // authorize to Tableau via PAT
      } catch (err) {
        res.status(500).json({ error: err });
        throw err;
      }
      if (sesh.authorized) {
        // spread members of the Session "sesh"
        const { 
          username, user_id, embed_key, rest_key, site_id, site, created, expires,
        } = sesh;
        const payload = await getMetrics(user_id, rest_key);
        res.status(200).json(payload);
      } else {
        res.status(401).json({ error: 'Unauthorized to perform operation' }); // cannot establish a session locally
      }

    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } else {
    // Not Signed in
    console.debug('unauthorized');
    res.status(401).json({ error: 'Unauthorized' }); // no application token available
  }
  res.end();
}

export default handler;

const getMetrics = async (user_id, rest_key) => {
  try {
    // request metrics
    const factory = new MetricsModel(user_id); // instantiate a new Metrics object for the logged in user
    const metrics = await factory.syncMetrics(rest_key); // request metrics for the user
    return metrics;
  } catch (err) {
    throw new Error('Metrics Error:', err);
  }
}
