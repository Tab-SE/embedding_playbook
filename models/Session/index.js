import { tabAuthPAT } from "../../libs";
import { handlePAT } from "./controller";

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
    credentials?.rest_key ? this.rest_key = credentials.rest_key : undefined;
    credentials?.embed_key ? this.embed_key = credentials.embed_key : undefined;
    // Get the current time in seconds since the epoch
    this.created = Math.floor(Date.now() / 1000); 
    // calculates the approximate expiration time
    this.expires = this.lifespan(credentials.expiration); 
    // allows authenticated operations to proceed
    this.authorized = true; 
    return this._returnSession();
  }

  // Personal Access Token authentication
  pat = async (pat_name, pat_secret) => {
    const credentials = await handlePAT(pat_name, pat_secret);
    this._authorize(credentials);
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