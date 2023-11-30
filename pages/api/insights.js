import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { getToken } from "next-auth/jwt"
import axios from "axios"

export default async (req, res) => {
  const token = await getToken({ req });
  const session = await getServerSession(req, res, authOptions);

  if (token && session) {
    // Signed in 
    console.log("JSON Web Token", JSON.stringify(token, null, 2));
    console.log("Session", JSON.stringify(session, null, 2));
    // request method handling
    if (req.method === 'POST') {
      try {
        // get pulse insights from Tableau
        // const result = await axios.request(config)
        // .then((response) => {
        //   console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        //   console.log(error);
        // });

        res.status(200).json({ 
          "JWT": token,
          "session": session 
        });
      } catch (err) {
        res.status(500).json({ error: '500 Failed to Insights' });
      }
    }
  } else {
    // Not Signed in
    console.log('unauthorized');
    res.status(401).json({ error: '401 Unauthorized' });
  }
  res.end()
}

