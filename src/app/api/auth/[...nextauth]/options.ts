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
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
        token.token_created = Date.now();
      }

      // Check if tokens need refresh (JWT tokens expire in 9 minutes)
      if (token.tableau && token.token_created) {
        const tokenAge = Date.now() - (token.token_created as number);
        const refreshThreshold = 8 * 60 * 1000; // 8 minutes in milliseconds

        if (tokenAge > refreshThreshold) {
          console.log('🔄 JWT tokens are old, refreshing...');
          try {
            // Import the refresh function here to avoid circular dependencies
            const { handleJWT } = await import('@/models/Session/controller');

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

            const { credentials, rest_token, embed_token } = await handleJWT(
              token.email as string,
              embed_options,
              embed_scopes,
              rest_options,
              rest_scopes,
              (token.uaf as any) || {}
            );

            // Update token with fresh data
            token.tableau = {
              ...token.tableau,
              username: credentials.username,
              user_id: credentials.user_id,
              embed_token,
              rest_token,
              rest_key: credentials.rest_key,
              site_id: credentials.site_id,
              site: credentials.site,
              created: credentials.created,
              expires: credentials.expiration
            };
            token.rest_token = rest_token;
            token.token_created = Date.now();

            console.log('✅ JWT tokens refreshed successfully');
          } catch (error) {
            console.error('❌ Failed to refresh JWT tokens:', error);
            // Don't throw error, just log it and continue with existing tokens
          }
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT; }) {
      const customSession = session as CustomSession;
      if (customSession.user) {
        customSession.user.demo = token.demo as string;
        // Add tableau data to session for client-side access
        (customSession as any).tableau = token.tableau;
        (customSession as any).rest_token = token.rest_token;
        (customSession as any).embed_token = (token.tableau as any)?.embed_token;
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}
