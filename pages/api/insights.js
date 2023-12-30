import { getToken } from "next-auth/jwt"


const handler = async (req, res) => {
  const token = await getToken({ req });

  // Signed in
  if (token.name) {
    // console.log("Server Token", JSON.stringify(token, null, 2));

    // get user attributes for temporary authorized sessions
    const { user, key } = token.rest.pulse;

    console.log('req:', req);

    if (req.method === 'GET') {
      console.log('insight req body:', req.body);
      if (Array.isArray(req.body.metrics)) {
        try {
          req.body.metrics.forEach(metric => {
            const insights = []; // temporar
            // bundle = metric.syncInsights(key);
            // insights.push[bundle];
          });
          res.status(200).json('nothing');
        } catch (err) {
          res.status(500).json({ error: err });
        }
      } else {
        res.status(405).json({ error: 'Method Not Allowed' });
      }
    } 
  } else {
    // Not Signed in
    console.debug('unauthorized');
    res.status(401).json({ error: 'Unauthorized' });
  }
  res.end();
}

export default handler;
