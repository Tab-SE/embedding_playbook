import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Session } from "../../../models"
import rls from "../../../rls.json"


export const authOptions = {
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid
    maxAge: 2 * 60 * 60, // 2 hrs to match Tableau https://help.tableau.com/current/online/en-us/to_security.htm#user-security
  },
  // Configure one or more authentication providers https://next-auth.js.org/configuration/initialization#api-routes-pages
  providers: [
    CredentialsProvider({
      type: 'credentials',
      id: 'demo-user',
      name: 'Demo User', // The name to display on the sign in form (e.g. 'Sign in with...')
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        ID: { label: "ID", type: "text", placeholder: "a, b, c, d or e" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let user = null;
        let sesh = null;
        for (const [key, value] of Object.entries(rls.users)) { // check all keys in rls.json user store
          if (key.toUpperCase() === credentials.ID.toUpperCase()) { // find keys that match credential
            user = value; // if a match is found store value as user
          }
        }
        if (user) {
          // server-side env vars
          const jwt_secret = process.env.TABLEAU_JWT_SECRET; 
          const jwt_secret_id = process.env.TABLEAU_JWT_SECRET_ID; 
          const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID; 
          // Scopes for Tableau metrics https://help.tableau.com/current/online/en-us/connected_apps_scopes.htm#pulse
          const scopes = [
            'tableau:views:embed',
            'tableau:views:embed_authoring',
            'tableau:insights:embed',
          ];
          // user provided during authentication is used to create a new Session
          sesh = new Session(user.name); 
          const jwt_options = { jwt_secret, jwt_secret_id, jwt_client_id };
          // authorize to Tableau via JWT
          await sesh.jwt(user.email, jwt_options, scopes);
          if (sesh.authorized) {
            // spread members of the Session "sesh"
             const { 
              username, user_id, embed_token, rest_key, site_id, site, created, expires,
            } = sesh;
            // add members to a new tableau object in user
            user.tableau = {
              username, user_id, embed_token, rest_key, site_id, site, created, expires,
            };
          }
          return sesh.authorized && user.tableau.embed_token ? user : false; // Return false to display a default error message
        } else {
          return false;
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    // documented here: https://next-auth.js.org/configuration/callbacks
    async signIn({ user, account, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account, profile, user }) {
      // console.count('jwt runs');
      // console.log('jwt token', token);

      // persist metadata added to user object in authorize() callback to the JWT as claims
      if (user) {
        token.picture = user.picture;
        token.uaf = user.uaf; // user attribute function claims
        token.tableau = user.tableau; // tableau session object
      }
      return token;
    },
    async session({ session, token, user }) {
      // database sessions pass user, JWT sessions pass token
      // console.count('session runs');

      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}

export default NextAuth(authOptions);
