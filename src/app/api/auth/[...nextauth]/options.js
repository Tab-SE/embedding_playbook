import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Session } from "models"
import { UserStore } from "settings"
import NextAuth from "next-auth"

const basePath = process.env.NEXT_PUBLIC_BASE_URL;
const domain = '.' + basePath.replace(/(^\w+:|^)\/\//, '');

console.log(`next_public_base_url: ${process.env.NEXT_PUBLIC_BASE_URL}`);
console.log(`base_url: ${process.env.BASE_URL}`);

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
        domain,
      }
    },
    callbackUrl: {
      name: '__Secure-next-auth.callback-url',
      options: {
        sameSite: 'none',
        path: '/',
        secure: true,
        domain,
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
    maxAge: 2 * 60 * 60,
  },
  jwt: {
    maxAge: 2 * 60 * 60,  // 2 mins
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      id: 'extension-user',
      name: 'Extension User',
      credentials: {
        tableauUrl: { label: "Tableau URL", type: "text" },
        userName: { label: "User Name", type: "text" },
        email: { label: "email", type: "text" },
        site_id: { label: "Site Name", type: "text" },
        caClientId: { label: "Client ID", type: "text" },
        caSecretId: { label: "Secret ID", type: "text" },
        caSecretValue: { label: "Secret Value", type: "text" },
      },
      async authorize(credentials, req) {
        let user = null;
        if (process.env?.DEBUG || process.env?.DEBUG?.toLowerCase() === 'true') {
          console.log(`Starting [...nextAuth].js flow.`)
          console.log(`starting initialize session for dashboard extension...${JSON.stringify(credentials)}`);
        }
        const rest_session = await initializeSession(credentials.userName, credentials, 'rest');


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
          if (process.env.DEBUG || process.env?.DEBUG?.toLowerCase() === 'true') {
            console.log(`user... ${JSON.stringify(user)}`)
          }
        }

        // Return false to display a default error message
        if (!user) {
          throw new Error('Invalid credentials');
        }
        return user.tableau ? user : false;
      }
    }),
    CredentialsProvider({
      type: 'credentials',
      id: 'demo-user',
      name: 'Demo User',
      credentials: {
        ID: { label: "ID", type: "text", placeholder: "a, b, c, d or e" },
        demo: { label: "Demo", type: "text" },
      },
      async authorize(credentials, req) {
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
        // add the demo to the user object to see it on the client
        user.demo = credentials.demo;
        const embed_session = await initializeSession(user, {}, 'embed', 'orig');
        const rest_session = await initializeSession(user, {}, 'rest', 'orig');

        if (embed_session.authorized && rest_session.authorized) {
          // frontend requires user_id & embed_token
          const {
            username, user_id, embed_token, site_id, site, created, expires,
          } = embed_session;
          const { user_id: rest_id, rest_key } = rest_session;
          user.tableau = {
            username, user_id, embed_token, rest_id, rest_key, site_id, site, created, expires,
          };
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
  ],
  callbacks: {
    async signIn({ user, account, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, account, profile, user }) {
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
      session.user.vector_store = token.vector_store;
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
  if (process.env?.DEBUG || process.env?.DEBUG?.toLowerCase() === 'true') {
    console.log(`creating new session in initialize session...${JSON.stringify(username)}.  credentials: ${JSON.stringify(credentials)}.  scopes: ${JSON.stringify(scopes)}`);
  }
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
