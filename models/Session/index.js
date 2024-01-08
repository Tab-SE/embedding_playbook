import { lifespan, handlePAT, handleJWT } from "./controller";

// Session designed to securely authorize users server-side PRIVATE routes
export class Session {
  constructor(username) {
    this.authorized = false; // flag controlling access to authenticated operations
    this.username = username;
    this.user_id = undefined;
    this.embed_key = undefined; // only JWT authentication supports embed keys
    this.rest_key = undefined; // some authentication methods only support REST API keys (PAT)
    this.site_id = undefined;
    this.site = undefined; // site name
    this.created = undefined; // Get the current time in seconds since the epoch
    this.expires = undefined; // estimated future expiry date
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
     };
   } else {
    return null;
   }
  }

  // set class members and authorized status
  _authorize = (credentials) => {
    // set data store
    this.site_id = credentials?.site_id;
    this.site = credentials?.site;
    this.user_id = credentials?.user_id;
    credentials?.rest_key ? this.rest_key = credentials.rest_key : undefined;
    credentials?.embed_key ? this.embed_key = credentials.embed_key : undefined;
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
    
    // allows authenticated operations to proceed
    this.authorized = true; 
    return this._returnSession();
  }

  // Personal Access Token authentication
  pat = async (pat_name, pat_secret) => {
    const credentials = await handlePAT(pat_name, pat_secret);
    this._authorize(credentials);
  }

  // JSON Web Token authentication
  jwt = async (sub, jwt_secret, jwt_secret_id, jwt_client_id, scopes) => {
    const credentials = await handleJWT(sub, jwt_secret, jwt_secret_id, jwt_client_id, scopes);
    this._authorize(credentials);
  }
  
}
