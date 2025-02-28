import { lifespan, handlePAT, handleJWT, JWTOptions, UAF } from "./controller";
import { tabSignOut } from "libs";

export interface Credentials {
  site_id?: string;
  site?: string;
  user_id?: string;
  rest_key?: string;
  created?: number;
  expiration?: number;
  uaf?: UAF;
}


// Session designed to securely authorize users server-side PRIVATE routes
export class Session {
  public authorized: boolean;
  public username: string;
  public user_id: string | null;
  public embed_token: string | null;
  public rest_token: string | null;
  public rest_key: string | null;
  public uaf: UAF | null;
  public site_id: string | null;
  public site: string | null;
  public created: Date | null;
  public expires: Date | null;

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
  _authorize = (credentials: Credentials, rest_token?:string, embed_token?: string) => {
    // set data store
    this.site_id = credentials?.site_id ?? null;
    this.site = credentials?.site ?? null;
    this.user_id = credentials?.user_id ?? null;
    this.uaf = credentials?.uaf || null;
    rest_token ? this.rest_token = rest_token : null;
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
    } else {
      this.created = null;
      this.expires = null;
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
  jwt = async (sub: string, embed_options: JWTOptions, embed_scopes: string[], rest_options: JWTOptions, rest_scopes: string[], uaf: UAF) => {
    const { credentials, rest_token, embed_token } = await handleJWT(sub, embed_options, embed_scopes, rest_options, rest_scopes, uaf);
    this._authorize(credentials, rest_token, embed_token);
  }
}
