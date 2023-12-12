import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"
import pulse from "../../utils/pulse"

export default handler = async (req, res) => {
  const token = await getToken({ req });
  const session = await getServerSession(req, res, authOptions);

   // Signed in 
   console.log("JSON Web Token", JSON.stringify(token, null, 2));
   console.log("Session", JSON.stringify(session, null, 2));

  if (token && session) {
    // get user attributes for temporary authorized sessions
    const { key, user } = token.rest.pulse;
    const insights = new Array();

    if (req.method === 'GET') {
      try {
        const subscriptions = await pulse.getSubscriptions(key, user);
        console.log('subscriptions', subscriptions);

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
    console.log('unauthorized');
    res.status(401).json({ error: '401 Unauthorized' });
  }
  res.end();
}

