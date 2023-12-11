import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"
import pulse from "../../utils/pulse"

export default async (req, res) => {
  const token = await getToken({ req });
  const session = await getServerSession(req, res, authOptions);

  if (token && session) {
    // get user attributes for temporary authorized sessions
    const { key, user } = token.rest.pulse;
    const insights = new Array();

    // Signed in 
    console.debug("JSON Web Token", JSON.stringify(token, null, 2));
    console.debug("Session", JSON.stringify(session, null, 2));

    if (req.method === 'GET') {
      try {
        const subscriptions = await pulse.getSubscriptions(key, user);
        if (subscriptions) {
          res.status(200).json({ subscriptions });
        } else {
          throw new Error('500 Failed to obtain Tableau Pulse subscriptions');
        }
      } catch (err) {
        res.status(500).json({ error: err });
      }
    }
  } else {
    // Not Signed in
    console.debug('unauthorized');
    res.status(401).json({ error: '401 Unauthorized' });
  }
  res.end();
}

