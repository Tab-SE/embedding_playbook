import { AuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { SessionModel, UserModel } from "@/models";

interface DemoUser extends User {
  picture?: string;
  demo?: string;
  role?: string;
  vector_store?: any;
  uaf?: any;
  tableau?: any;
  rest_token?: string;
}

interface CustomSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    demo?: string;
  }
}


export const authOptions: AuthOptions = {
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
      async authorize(credentials: any, req) {
        let user: any = null;

        const demoManager = new UserModel();
        const currentDemo = demoManager.getDemoByName(credentials.demo);

        if (currentDemo) {
          // Find the user in the users array of the matched demo object
          const matchedUser = currentDemo.users.find(
            (user) => user.id.toUpperCase() === credentials.ID.toUpperCase()
          );

          if (matchedUser) {
            user = { ...matchedUser }; // Clone the matched user object
            user.demo = credentials.demo;
            user.uaf = user.uaf || {};

            const jwt_client_id = process.env.TABLEAU_JWT_CLIENT_ID;
            const embed_secret = process.env.TABLEAU_EMBED_JWT_SECRET;
            const embed_secret_id = process.env.TABLEAU_EMBED_JWT_SECRET_ID;
            const rest_secret = process.env.TABLEAU_REST_JWT_SECRET;
            const rest_secret_id = process.env.TABLEAU_REST_JWT_SECRET_ID;

            // Client-safe Connected App scopes
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
            // Backend secured Connected App scopes
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
              "tableau:views:embed_authoring"
            ];
            const rest_options = {
              jwt_secret: rest_secret,
              jwt_secret_id: rest_secret_id,
              jwt_client_id
            };

            const session = new SessionModel(user.name);
            await session.jwt(user.email, embed_options, embed_scopes, rest_options, rest_scopes, user.uaf);

            if (session.authorized) {
              const {
                username,
                user_id,
                embed_token,
                rest_token,
                rest_key,
                site_id,
                site,
                created,
                expires
              } = session;

              user.tableau = {
                username,
                user_id,
                embed_token,
                rest_token,
                rest_key,
                site_id,
                site,
                created,
                expires
              };
            }

            return user.tableau ? user : null;
          } else {
            return null;
          }
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
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
      // Use the public URL from environment variable if available, otherwise use baseUrl
      let publicUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || baseUrl;

      // If we're in production and the baseUrl contains railway.internal, use the public URL
      if (process.env.NODE_ENV === 'production' && baseUrl.includes('railway.internal')) {
        publicUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'https://embedding-playbook.railway.app';
      }

      if (url.startsWith("/")) return `${publicUrl}${url}`;
      else if (new URL(url).origin === publicUrl) return url;
      return publicUrl;
    },
    async jwt({ token, user }: { token: JWT; user?: DemoUser }) {
      if (user) {
        token.picture = user.picture;
        token.demo = user.demo;
        token.role = user.role;
        const vectors = {
          metrics: user.vector_store,
          workbooks: user.vector_store,
          datasources: user.vector_store,
        };
        token.vectors = vectors;
        token.uaf = user.uaf || {};
        token.tableau = user.tableau;
        token.rest_token =  user.rest_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT; }) {
      const customSession = session as CustomSession;
      if (customSession.user) {
        customSession.user.demo = token.demo as string;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}
