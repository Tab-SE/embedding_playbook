import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { Session } from "models";
import { UserStore } from "settings";


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
        demo: { label: "Demo", type: "text" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let user = null;
        // maps logins to specific demos so non-demo sessions can be logged out
        const demo = UserStore[credentials.demo]
        // check all keys in user store
        for (const [key, value] of Object.entries(demo.users)) {
          // find keys that match credential
          if (key.toUpperCase() === credentials.ID.toUpperCase()) {
            // if a match is found store value as user
            user = value;
          }
        }
        if (user) {
          // add the demo to the user object to see it on the client
          user.demo = credentials.demo;
          // server-side env vars
          const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID;
          const embed_secret = process.env.TABLEAU_EMBED_JWT_SECRET;
          const embed_secret_id = process.env.TABLEAU_EMBED_JWT_SECRET_ID;
          const rest_secret = process.env.TABLEAU_REST_JWT_SECRET;
          const rest_secret_id = process.env.TABLEAU_REST_JWT_SECRET_ID;

          // used for frontend embeds
          const embed_scopes = [
            "tableau:views:embed",
            "tableau:views:embed_authoring",
            "tableau:insights:embed",
          ];
          const embed_options = {
            jwt_secret: embed_secret,
            jwt_secret_id: embed_secret_id,
            jwt_client_id
          };
          const embed_session = new Session(user.name);
          await embed_session.jwt(user.email, embed_options, embed_scopes);

          // used for backend HTTP calls
          const rest_scopes = [
            "tableau:datasources:read",
            "tableau:workbooks:read",
            "tableau:projects:read",
            "tableau:insight_definitions_metrics:read",
            "tableau:insight_metrics:read",
            "tableau:insights:read",
            "tableau:metric_subscriptions:read",
          ];
          const rest_options = {
            jwt_secret: rest_secret,
            jwt_secret_id: rest_secret_id,
            jwt_client_id
          };
          const rest_session = new Session(user.name);
          await rest_session.jwt(user.email, rest_options, rest_scopes);
          if (embed_session.authorized && rest_session.authorized) {
            // frontend requires user_id & embed_token
             const {
              username, user_id, embed_token, site_id, site, created, expires,
            } = embed_session;
            // backend requires rest_id & rest_key
            const { user_id: rest_id, rest_key } = rest_session;
            // add members to a new tableau object in user
            user.tableau = {
              username, user_id, embed_token, rest_id, rest_key, site_id, site, created, expires,
            };
          }

          // Return false to display a default error message
          return user.tableau ? user : false;
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
      // persist metadata added to user object in authorize() callback to the JWT as claims
      if (user) {
        token.picture = user.picture;
        token.demo = user.demo;
        token.role = user.role; // tableau session object
        token.vector_store = user.vector_store; // tableau session object
        token.uaf = user.uaf; // user attribute function claims
        token.tableau = user.tableau; // tableau session object

      }
      return token;
    },
    async session({ session, token, user }) {
      // database sessions pass user, JWT sessions pass token
      // console.count('session runs');
      session.user.vector_store = token.vector_store;
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}

export default NextAuth(authOptions);
