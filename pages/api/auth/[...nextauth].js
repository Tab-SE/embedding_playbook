import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { Session } from "models";
import { settings } from "settings";


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
        tableauUrl: { label: "Tableau URL", type: "text" },
        userName: { label: "User Name", type: "text" },
        email: { label: "email", type: "text" },
        siteName: { label: "Site Name", type: "text" },
        caClientId: { label: "Client ID", type: "text" },
        caSecretId: { label: "Secret ID", type: "text" },
        caSecretValue: { label: "Secret Value", type: "text" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let user = null;
        if (!credentials.userName) throw new Error('Invalid credentials: Missing userName');

        if (credentials.userName === 'undefined') return false;
        if (credentials.isDashboardExtension === 'true') {
          // When isDashboardExtension is passed, use the provided details
          const rest_session = await initializeSession(credentials, 'rest');

          if (rest_session.authorized) {
            user = {
              name: credentials.userName,
              email: credentials.userName,
              tableau: {
                ...rest_session,
                tableauUrl: credentials.tableauUrl,
                username: credentials.userName,
                site: credentials.siteName,
              }
            };
            console.log(`user...`)
            console.log(JSON.stringify(user));
          }
        } else {
          // When isDashboardExtension is not passed, use stored user data and environment variables
          for (const [key, value] of Object.entries(settings.demo_users)) {
            if (key.toUpperCase() === credentials.ID.toUpperCase()) {
              user = value;
            }
          }
          if (user) {
            const embed_session = await initializeSession(user, 'embed', 'orig');
            const rest_session = await initializeSession(user, 'rest', 'orig');

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
          }
        }
        if (!user) {
          throw new Error('Invalid credentials');
        }
        return user || false;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) { // user will only exist on the first call, not subsequent calls
        token.picture = user.picture;
        token.uaf = user.uaf; // user attribute function claims
        token.tableau = user.tableau; // tableau session object
        token.tableauUrl = user.tableau.tableauUrl;
      }
      return token;
    },
    async session({ session, token }) {
      session.tableau = token.tableau;
      session.tableau.tableauUrl = token.tableauUrl;
      if (!session.tableau.rest_id) session.tableau.rest_id = session.tableau.user_id; // TODO - this ties in to rest_id being missing in api/metrics/methods.js
      session.tableau.siteName = token.siteName; // duplicated as site
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
};

async function initializeSession(user, type = 'rest', method = 'new') {
  const clientId = user.isDashboardExtension === 'true' ? user.caClientId : process.env.TABLEAU_JWT_CLIENT_ID;
  const secret = user.isDashboardExtension === 'true' ? user.caSecretValue : type === 'rest' ? process.env.TABLEAU_REST_JWT_SECRET : process.env.TABLEAU_EMBED_JWT_SECRET;
  const secretId = user.isDashboardExtension === 'true' ? user.caSecretId : type === 'rest' ? process.env.TABLEAU_REST_JWT_SECRET_ID : process.env.TABLEAU_EMBED_JWT_SECRET_ID;
  const scopes = type === 'rest' ? [
    "tableau:datasources:read",
    "tableau:workbooks:read",
    "tableau:projects:read",
    "tableau:insight_definitions_metrics:read",
    "tableau:insight_metrics:read",
    "tableau:insights:read",
    "tableau:metric_subscriptions:read",
    "tableau:content:read"
  ] : [
    "tableau:views:embed",
    "tableau:views:embed_authoring",
    "tableau:insights:embed",
  ];

  const options = {
    jwt_secret: secret,
    jwt_secret_id: secretId,
    jwt_client_id: clientId
  };

  const session = new Session(user);
  if (method === 'orig'){
    await session.jwt(user.email || user.userName, options, scopes);
  }
  else {
    type === 'rest' ?
     await session.restjwt(options, scopes)
    :
    await session.embedjwt(options, scopes);
  }
  return session;
}

export default NextAuth(authOptions);
