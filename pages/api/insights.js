import { getToken } from "next-auth/jwt"
import { Session, InsightsModel } from "../../models";


const handler = async (req, res) => {
  const token = await getToken({ req });

  // Signed in
  if (token?.name && token?.sub) {
    if (req.method === 'GET') {
      // session object
      let sesh;



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
          throw err;
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
