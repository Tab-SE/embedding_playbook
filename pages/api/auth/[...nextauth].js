import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { Session } from "models";
import { UserStore } from "settings";

let cookies = null;
if (process.env.NODE_ENV === 'production') {
  cookies = {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
        domain: '.embedding-playbook-navy.vercel.app',
      }
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        sameSite: 'none',
        path: '/',
        secure: true,
        domain: '.embedding-playbook-navy.vercel.app',
      }
    },
    csrfToken: {
      name: '__Host-next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
        // domain removed - https://stackoverflow.com/questions/76872800/why-is-my-cookie-prefixed-with-host-getting-rejected-by-chrome
      }
    },
  }
}

export const authOptions = {
  cookies,
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
        demo: { label: "Demo", type: "text" },
        tableauUrl: { label: "Tableau URL", type: "text" },
        userName: { label: "User Name", type: "text" },
        email: { label: "email", type: "text" },
        site_id: { label: "Site Name", type: "text" },
        caClientId: { label: "Client ID", type: "text" },
        caSecretId: { label: "Secret ID", type: "text" },
        caSecretValue: { label: "Secret Value", type: "text" },
        isDashboardExtension: { label: "Dashboard Extension", type: "text" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        let user = null;

        console.log(`Starting [...nextAuth].js flow.`)

        if (credentials.isDashboardExtension === 'true') {
          console.log(`starting initialize session for dashboard extension...${JSON.stringify(credentials)}`);
          const rest_session = await initializeSession(credentials.userName, credentials, 'rest');
          console.log(`returning from initializeSession - rest_session: ${JSON.stringify(rest_session)}`);

          if (rest_session.authorized) {
            user = {
              name: credentials.userName,
              email: credentials.userName,
              tableau: {
                ...rest_session,
                tableauUrl: credentials.tableauUrl,
                username: credentials.userName,
                site: credentials.site_id,
              }
            };
            console.log(`user... ${JSON.stringify(user)}`)
          }
        } else {
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
          // add the demo to the user object to see it on the client
          user.demo = credentials.demo;
          const embed_session = await initializeSession(user, {}, 'embed', 'orig');
          const rest_session = await initializeSession(user, {}, 'rest', 'orig');


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
        // Return false to display a default error message
        if (!user) {
          throw new Error('Invalid credentials');
        }
        return user.tableau ? user : false;
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
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
      session.tableau = token.tableau;
      // session.tableau.tableauUrl = token.tableauUrl;
      if (!session.tableau.rest_id) session.tableau.rest_id = session.tableau.user_id; // TODO - this ties in to rest_id being missing in api/metrics/methods.js
      // session.tableau.site_id = token.site_id; // duplicated as site
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}


async function initializeSession(username, credentials, type = 'rest', method = 'new') {
  const clientId = credentials?.isDashboardExtension === 'true' ? credentials.caClientId : process.env.TABLEAU_JWT_CLIENT_ID;
  const secret = credentials?.isDashboardExtension === 'true' ? credentials.caSecretValue : type === 'rest' ? process.env.TABLEAU_REST_JWT_SECRET : process.env.TABLEAU_EMBED_JWT_SECRET;
  const secretId = credentials?.isDashboardExtension === 'true' ? credentials.caSecretId : type === 'rest' ? process.env.TABLEAU_REST_JWT_SECRET_ID : process.env.TABLEAU_EMBED_JWT_SECRET_ID;
  const scopes = type === 'rest' ? [
    "tableau:datasources:read",
    "tableau:workbooks:read",
    "tableau:projects:read",
    "tableau:insight_definitions_metrics:read",
    "tableau:insight_metrics:read",
    "tableau:insight_metrics:create", // used for metrics:getOrCreate
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

  console.log(`creating new session in initialize session...${JSON.stringify(username)}.  credentials: ${JSON.stringify(credentials)}.  scopes: ${JSON.stringify(scopes)}`);
  const session = new Session(username, credentials);
  if (method === 'orig') {
    await session.jwt(username, options, scopes);
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
