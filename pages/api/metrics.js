import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"
import Metrics from '../../models/Metrics'


const handler = async (req, res) => {
  const token = await getToken({ req });
  const session = await getServerSession(req, res, authOptions);

  if (token && session) {
    // Signed in 
    // console.log("Server Token", JSON.stringify(token, null, 2));
    // console.log("Server Session", JSON.stringify(session, null, 2));

    // get user attributes for temporary authorized sessions
    const { key, user } = token.rest.pulse;

    if (req.method === 'GET') {
      try {
        const metrics = new Metrics(user); // instantiate a new Metrics object for the logged in user
        const payload = await metrics.getMetrics(key); // request metrics for the user
        console.log('P A Y L O A D ! :', JSON.stringify(payload, null, 2));
        res.status(200).json(payload);
      } catch (err) {
        res.status(500).json({ error: err });
      }




    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } else {
    // Not Signed in
    console.log('unauthorized');
    res.status(401).json({ error: 'Unauthorized' });
  }
  res.end();
}


export default handler;

