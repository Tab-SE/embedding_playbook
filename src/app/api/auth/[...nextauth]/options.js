import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { Session } from "models"
import { UserStore } from "settings"

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      id: 'demo-user',
      name: 'Demo User',
      credentials: {
        ID: { label: "ID", type: "text", placeholder: "a, b, c, d or e" },
        demo: { label: "Demo", type: "text" }
      },
      async authorize(credentials, req) {
        let user = null;
        const demo = UserStore[credentials.demo]
        for (const [key, value] of Object.entries(demo.users)) {
          if (key.toUpperCase() === credentials.ID.toUpperCase()) {
            user = value;
          }
        }
        if (user) {
          user.demo = credentials.demo;
          const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID;
          const embed_secret = process.env.TABLEAU_EMBED_JWT_SECRET;
          const embed_secret_id = process.env.TABLEAU_EMBED_JWT_SECRET_ID;
          const rest_secret = process.env.TABLEAU_REST_JWT_SECRET;
          const rest_secret_id = process.env.TABLEAU_REST_JWT_SECRET_ID;

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

          const rest_scopes = [
            "tableau:content:read",
            "tableau:datasources:read",
            "tableau:workbooks:read",
            "tableau:projects:read",
            "tableau:insights:read",
            "tableau:metric_subscriptions:read",
            "tableau:insight_definitions_metrics:read",
            "tableau:insight_metrics:read",
            "tableau:metrics:download",
          ];
          const rest_options = {
            jwt_secret: rest_secret,
            jwt_secret_id: rest_secret_id,
            jwt_client_id
          };
          const rest_session = new Session(user.name);
          await rest_session.jwt(user.email, rest_options, rest_scopes);
          if (embed_session.authorized && rest_session.authorized) {
            const {
              username, user_id, embed_token, site_id, site, created, expires,
            } = embed_session;
            const { user_id: rest_id, rest_key } = rest_session;
            user.tableau = {
              username, user_id, embed_token, rest_id, rest_key, site_id, site, created, expires,
            };
          }

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
        token.role = user.role;
        token.vector_store = user.vector_store;
        token.uaf = user.uaf;
        token.tableau = user.tableau;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.vector_store = token.vector_store;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}
