import { Session } from "../models";

export const serverJWT = async (
  user, jwt_options, scopes
) => {
  // user provided during authentication is used to create a new Session
  const session = new Session(user.name);
  // authorize to Tableau via JWT
  await session.jwt(user.sub, jwt_options, scopes);

  if (session.authorized) {
    // spread members of the Session "sesh"
    return { 
      username, user_id, embed_key, rest_key, site_id, site, created, expires,
    } = session;
  } else {
    // cannot establish a session locally
    throw new Error('Cannot establish a session with Tableau');
  }
};

export const serverPAT = async () => {
 return;
};
