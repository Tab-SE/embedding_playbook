import { SessionModel } from "models";

// server-side access to JWT sessions with Tableau
export const serverJWT = async (user, jwt_options, scopes) => {
  // user provided during authentication is used to create a new Session
  const session = new SessionModel(user.name);
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
  const session = new SessionModel(username);
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
