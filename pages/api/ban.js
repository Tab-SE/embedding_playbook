import { getToken } from "next-auth/jwt"
import { serverJWT, serverPAT, getBanBundle, getSubscriptions } from "../../libs";

// server-side env vars
const pat_name = process.env.PULSE_PAT_NAME;
const pat_secret = process.env.PULSE_PAT_SECRET;
const jwt_options = { 
  jwt_secret: process.env.TABLEAU_JWT_SECRET, 
  jwt_secret_id: process.env.TABLEAU_JWT_SECRET_ID, 
  jwt_client_id: process.env.TABLEAU_JWT_CLIENT_ID, 
};

// handles authentication, HTTP methods and responding with data or errors
const handler = async (req, res) => {
  const token = await getToken({ req });
  // Signed in
  if (token?.name && token?.sub) {
    if (req.method === 'POST') {
      // session object
      let session; 
      try {
        session = await getCredentials(token);
      } catch (err) {
        res.status(500).json({ error: err });
        throw err;
      }
      const payload = await makePayload(session, req.body.metric);
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

// makes the response body for the API
const makePayload = async (session, metric) => {
  if (session.authorized && metric) {
    const { user_id, rest_key } = session;
    let bundle;
    try {
      // bundle = await getSubscriptions(rest_key, user_id)
      // console.log(`subs ${metric.name}`, bundle);

      // request insights
      bundle = await getBanBundle(rest_key, metric);
      // console.log(`bundle ${metric.name}`, bundle);

    } catch (err) {
      return err;
    }
    return bundle;
  } else {
    // errors resolve to false when checked
    return new Error('Cannot perform operation without required params');
  }
}

// establishes REST API authentication with Tableau
const getCredentials = async (token) => {
  // name for session reference, sub for token signing
  const user = {
    name: token.name,
    sub: token.sub,
  };
  // Scopes for Tableau metrics https://help.tableau.com/current/online/en-us/connected_apps_scopes.htm#pulse
  const scopes = [
    'tableau:insights:read',
  ];
  // authorize to Tableau via JWT
  // let session = await serverJWT(user, jwt_options, scopes);
  // authorize to Tableau via PAT
  let session = await serverPAT(token.name, pat_name, pat_secret);

  return session;
}
