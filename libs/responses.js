import { Session, MetricsModel } from "../models";

// server-side access to JWT sessions with Tableau
export const serverJWT = async (user, jwt_options, scopes) => {
  // user provided during authentication is used to create a new Session
  const session = new Session(user.name);
  // authorize to Tableau via JWT
  await session.jwt(user.sub, jwt_options, scopes);
  if (session.authorized) {
    // spread members of the Session "sesh"
    return session;
  } else {
    // cannot establish a session locally
    throw new Error('Cannot establish a session with Tableau');
  }
};

// server-side access to PAT sessions with Tableau
export const serverPAT = async (username, pat_name, pat_secret) => {
  // user provided during authentication is used to create a new Session
  const session = new Session(username);
  // authorize to Tableau via PAT
  await session.pat(pat_name, pat_secret);
  if (session.authorized) {
    // spread members of the Session "sesh"
    return session;
  } else {
    // cannot establish a session locally
    throw new Error('Cannot establish a session with Tableau');
  }
};

// make an array of metrics
export const makeMetrics = async (user_id, rest_key) => {
  try {
    // instantiate a new Metrics object for the logged in user
    const factory = new MetricsModel(user_id); 
    // request metrics for the user
    const metrics = await factory.syncMetrics(rest_key); 
    return metrics;
  } catch (err) {
    throw new Error('Metrics Error:', err);
  }
}
