import { getToken } from "next-auth/jwt"
import { getBanBundle } from "../../libs";


// handles authentication, HTTP methods and responding with data or errors
const handler = async (req, res) => {
  // session token specific to each user
  const token = await getToken({ req });
  // Signed in
  if (token?.tableau) {
    if (req.method === 'POST') {
      // only responds with data to authorized users
      const payload = await makePayload(token.tableau.rest_key, req.body.metric);
      if (payload) {
        res.status(200).json(payload);
      } else {
        // cannot establish a session locally
        res.status(401).json({ error: payload }); 
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

// server-side env vars
const pat_name = process.env.PULSE_PAT_NAME;
const pat_secret = process.env.PULSE_PAT_SECRET;
const jwt_options = { 
  jwt_secret: process.env.TABLEAU_JWT_SECRET, 
  jwt_secret_id: process.env.TABLEAU_JWT_SECRET_ID, 
  jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID, 
};

// makes the response body for the API
const makePayload = async (rest_key, metric) => {
  if (rest_key && metric) {
    let bundle;
    try {
      // request insights
      bundle = await getBanBundle(rest_key, metric);
    } catch (err) {
      return err;
    }
    return bundle;
  } else {
    // errors resolve to false when checked
    return new Error('Cannot perform operation without required params');
  }
}
