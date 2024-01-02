import { tabAuthPAT } from "../libs";

// Session designed to securely authorize users server-side PRIVATE routes
export class Session {
  constructor(username) {
    this.authorized = false; // flag controlling access
    this.username = username;
    this.user_id = undefined;
    this.embed_key = undefined;
    this.rest_key = undefined;
    this.site_id = undefined;
    this.site = undefined; // site name
    this.created = undefined; // Get the current time in seconds since the epoch
    this.expires = undefined; // estimated future expiry date
  }

  returnSession = () => {
    if (this.authorized) {
      return { 
       name: this.username,
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

  authorizePAT = async (pat_name, pat_secret) => {
    const { site_id, site, user_id, api_key, expiration }  = await tabAuthPAT(pat_name, pat_secret);
    this.created = Math.floor(Date.now() / 1000); // Get the current time in seconds since the epoch
    this.site_id = site_id;
    this.site = site;
    this.user_id = user_id;
    this.rest_key = api_key;
    this.expires = this.lifespan(expiration);
    this.authorized = true;
    return this.returnSession();
  }

  authorizeJWT = async (jwt) => {
    return this.returnSession();
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
