import { lifespan, handlePAT, handleJWT } from "./controller";
import { tabSignOut } from "../../libs";

// Session designed to securely authorize users server-side PRIVATE routes
export class Session {
  constructor(username) {
    this.authorized = false; // flag controlling access to authenticated operations
    this.username = username;
    this.user_id = null;
    this.embed_token = null; // only JWT authentication supports embed keys
    this.rest_key = null; // some authentication methods only support REST API keys (PAT)
    this.site_id = null;
    this.site = null; // site name
    this.created = null; // Get the current time in seconds since the epoch
    this.expires = null; // estimated future expiry date
    this.uaf = null; // RLS with UAF
  }

  // securely return session data
  _returnSession = () => {
    if (this.authorized) {
      return { 
       username: this.username,
       user_id: this.user_id, 
       rest_key: this.rest_key, 
       site_id: this.site_id, 
       site: this.site, 
       created: this.created, 
       expires: this.expires,
       uaf: this.uaf,
     };
   } else {
    return null;
   }
  }

  // set class members and authorized status
  _authorize = (credentials, embed_token) => {
    // set data store
    this.site_id = credentials?.site_id;
    this.site = credentials?.site;
    this.user_id = credentials?.user_id;
    this.uaf = credentials?.uaf || null;
    // API key from the REST API credentials response
    credentials?.rest_key ? this.rest_key = credentials.rest_key : null;
    // JWT token used for embedding on the frontend
    embed_token ? this.embed_token = embed_token : null;
    // Authentication methods differ on availability of session life
    if (credentials?.created && credentials?.expiration) {
      // if session life is available, set local variables
      this.created = new Date(credentials.created * 1000); // convert the timestamps back to a Date objects
      this.expires = new Date(credentials.expiration * 1000); 
    } else if (credentials?.expiration) {
      // if only expiration is available, calculate created
      const { created, expires } = lifespan(credentials.expiration); // calculate useful timestamps as Date objects
      this.created = created; 
      this.expires = expires;
    }

    if (this.rest_key || this.embed_token) {
      // allows authenticated operations to proceed
      this.authorized = true; 
      return this._returnSession();
    } else {
      // no keys, no session
      this.authorized = false; 
      throw new Error('Cannot authorize user')
    }
  }

  // must be called after sessions are used to prevent server 401
  signout = async () => {
    await tabSignOut();
  }

  // Personal Access Token authentication
  pat = async (pat_name, pat_secret) => {
    const credentials = await handlePAT(pat_name, pat_secret);
    this._authorize(credentials);
  }

  // JSON Web Token authentication
  jwt = async (sub, jwt_options, scopes, claims) => {
    console.log("claims src models", claims)
    const { credentials, embed_token } = await handleJWT(sub, jwt_options, scopes, claims);
    this._authorize(credentials, embed_token);
  }
  
}
