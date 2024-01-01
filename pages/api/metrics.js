import { getToken } from "next-auth/jwt"
import { MetricsModel } from '../../models'


const handler = async (req, res) => {
  const token = await getToken({ req });

  // Signed in
  if (token.name) {

    // get attributes from token for secure server-side processing
    const { user_id, rest_key } = token.tableau;

    if (req.method === 'GET') {
      try {
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
