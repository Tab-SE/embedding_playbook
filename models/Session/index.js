import { tabAuthPAT } from "../../libs";
import { authorizePAT } from "./controller";

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

  _returnSession = () => {
    console.log('Session', this);
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

  _authorize = (credentials) => {
    // set data store
    this.site_id = credentials?.site_id;
    this.site = credentials?.site;
    this.user_id = credentials?.user_id;
    credentials?.rest_key ? this.rest_key = credentials.rest_key : null;
    credentials?.embed_key ? this.embed_key = credentials.embed_key : null;
    // Get the current time in seconds since the epoch
    this.created = Math.floor(Date.now() / 1000); 
    // calculates the approximate expiration time
    this.expires = this.lifespan(expiration); 
    // allows authenticated operations to proceed
    this?.created && this?.expires ? this.authorized = true : null; 
    return this._returnSession();
  }

  pat = async (pat_name, pat_secret) => {
    const credentials = { 
      site_id: site_id, 
      site: site, 
      user_id: user_id, 
      rest_key: rest_key, // only REST API key is returned, embed key not supported via PAT
      expiration: expiration 
    }  = await authorizePAT(pat_name, pat_secret);
    this._authorize(credentials);
  }

  authorizePAT = async (pat_name, pat_secret) => {
    const { site_id, site, user_id, rest_key, expiration }  = await tabAuthPAT(pat_name, pat_secret);
    this.created = Math.floor(Date.now() / 1000); // Get the current time in seconds since the epoch
    this.site_id = site_id;
    this.site = site;
    this.user_id = user_id;
    this.rest_key = rest_key;
    this.expires = this.lifespan(expiration);
    this.authorized = true;
    return this._returnSession();
  }

  authorizeJWT = async (jwt) => {
    return this._returnSession();
  }

  // calculates the lifespan for the session (estimated)
  lifespan = (estimatedTimeToExpiration) => {
    // parse the duration string into hours, minutes, and seconds
    const [hours, minutes, seconds] = estimatedTimeToExpiration.split(':').map(Number);
    // calculate the total seconds in the duration
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    // calculate the expiration time in seconds
    const expirationTime = this.created + totalSeconds;
    // convert the timestamps back to a Date objects
    this.created = new Date(this.created * 1000);
    const expirationDate = new Date(expirationTime * 1000);
    return expirationDate
  };
  
}

export default Session;
