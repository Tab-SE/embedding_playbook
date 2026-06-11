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
  groups?: string[];
  tableau?: any;
  tableau_eacanada?: any;
  tableau_ubl?: any;
  rest_token?: string;
  salesforceUsername?: string;
}

interface CustomSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    demo?: string;
    salesforceUsername?: string;
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

            // Also authenticate to EACanada server if credentials are available
            const eacanada_jwt_client_id = process.env.EACANADA_JWT_CLIENT_ID;
            const eacanada_embed_secret = process.env.EACANADA_EMBED_JWT_SECRET;
            const eacanada_embed_secret_id = process.env.EACANADA_EMBED_JWT_SECRET_ID;
            const eacanada_rest_secret = process.env.EACANADA_REST_JWT_SECRET;
            const eacanada_rest_secret_id = process.env.EACANADA_REST_JWT_SECRET_ID;

            if (eacanada_jwt_client_id && eacanada_embed_secret && eacanada_rest_secret) {
              const eacanada_embed_options = {
                jwt_secret: eacanada_embed_secret,
                jwt_secret_id: eacanada_embed_secret_id,
                jwt_client_id: eacanada_jwt_client_id
              };
              const eacanada_rest_options = {
                jwt_secret: eacanada_rest_secret,
                jwt_secret_id: eacanada_rest_secret_id,
                jwt_client_id: eacanada_jwt_client_id
              };

              const eacanada_session = new SessionModel(user.name);
              try {
                await eacanada_session.jwtEACanada(user.email, eacanada_embed_options, embed_scopes, eacanada_rest_options, rest_scopes, user.uaf);

                if (eacanada_session.authorized) {
                  const {
                    user_id: eacanada_user_id,
                    embed_token: eacanada_embed_token,
                    rest_token: eacanada_rest_token,
                    rest_key: eacanada_rest_key,
                    site_id: eacanada_site_id,
                    site: eacanada_site,
                    created: eacanada_created,
                    expires: eacanada_expires
                  } = eacanada_session;

                  // Use the same username as the regular tableau session, or fallback to user.name
                  const username = user.tableau?.username || user.name;

                  user.tableau_eacanada = {
                    username: username,
                    user_id: eacanada_user_id,
                    embed_token: eacanada_embed_token,
                    rest_token: eacanada_rest_token,
                    rest_key: eacanada_rest_key,
                    site_id: eacanada_site_id,
                    site: eacanada_site,
                    created: eacanada_created,
                    expires: eacanada_expires
                  };
                }
              } catch (error) {
                // Continue without eacanada auth if it fails
              }
            }

            // Also authenticate to UBL server if credentials are available
            const ubl_jwt_client_id = process.env.UBL_JWT_CLIENT_ID;
            const ubl_embed_secret = process.env.UBL_EMBED_JWT_SECRET;
            const ubl_embed_secret_id = process.env.UBL_EMBED_JWT_SECRET_ID;
            const ubl_rest_secret = process.env.UBL_REST_JWT_SECRET;
            const ubl_rest_secret_id = process.env.UBL_REST_JWT_SECRET_ID;

            // UBL uses a narrower embed scope set: ODA's documented supported scopes are only
            // `tableau:views:embed` and `tableau:views:embed_authoring`. Including
            // `tableau:insights:embed` here can cause Tableau to drop custom JWT claims
            // (UAF / groups) silently for ODA users.
            const ubl_embed_scopes = [
              "tableau:views:embed",
              "tableau:views:embed_authoring",
            ];

            if (ubl_jwt_client_id && ubl_embed_secret && ubl_rest_secret) {
              const ubl_embed_options = {
                jwt_secret: ubl_embed_secret,
                jwt_secret_id: ubl_embed_secret_id,
                jwt_client_id: ubl_jwt_client_id
              };
              const ubl_rest_options = {
                jwt_secret: ubl_rest_secret,
                jwt_secret_id: ubl_rest_secret_id,
                jwt_client_id: ubl_jwt_client_id
              };

              // Tableau ODA (On-Demand Access) claims: assert ODA enrollment and the user's
              // group memberships. Groups come from the user record (per-user dynamic).
              // TEMP DISABLED for UAF debugging.
              const ubl_extra_claims: Record<string, unknown> = {
                'https://tableau.com/oda':"true",
                'https://tableau.com/groups': (user as any).groups ?? [],
              };

              const ubl_session = new SessionModel(user.name);
              try {
                await ubl_session.jwtUBL(user.email, ubl_embed_options, ubl_embed_scopes, ubl_rest_options, rest_scopes, user.uaf, ubl_extra_claims);

                if (ubl_session.authorized) {
                  const {
                    user_id: ubl_user_id,
                    embed_token: ubl_embed_token,
                    rest_token: ubl_rest_token,
                    rest_key: ubl_rest_key,
                    site_id: ubl_site_id,
                    site: ubl_site,
                    created: ubl_created,
                    expires: ubl_expires
                  } = ubl_session;

                  // Use the same username as the regular tableau session, or fallback to user.name
                  const username = user.tableau?.username || user.name;

                  user.tableau_ubl = {
                    username: username,
                    user_id: ubl_user_id,
                    embed_token: ubl_embed_token,
                    rest_token: ubl_rest_token,
                    rest_key: ubl_rest_key,
                    site_id: ubl_site_id,
                    site: ubl_site,
                    created: ubl_created,
                    expires: ubl_expires
                  };
                }
              } catch (error) {
                // Continue without ubl auth if it fails
              }
            }

            // Return user if any of the tableau authentications succeeded
            return (user.tableau || user.tableau_eacanada || user.tableau_ubl) ? user : null;
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
        token.groups = user.groups || [];
        token.tableau = user.tableau;
        token.tableau_eacanada = user.tableau_eacanada;
        token.tableau_ubl = user.tableau_ubl;
        token.rest_token =  user.rest_token;
        // Add Salesforce username for TabNext JWT Bearer Flow
        token.salesforceUsername = user.salesforceUsername;
      } else {
        // Check if we need to refresh the Tableau JWT tokens
        // Refresh if token expires in less than 4 minutes (to be safe).
        // NOTE: `expires` is set as a Date in SessionModel, but NextAuth serializes
        // the JWT cookie via JSON.stringify so it round-trips back as an ISO string.
        // Coerce via `new Date(...)` so the comparison is always seconds-vs-seconds.
        const now = Math.floor(Date.now() / 1000);
        const toEpochSeconds = (v: unknown): number => {
          if (!v) return 0;
          const ms = new Date(v as any).getTime();
          return Number.isFinite(ms) ? Math.floor(ms / 1000) : 0;
        };
        const tableauToken = token.tableau as any;
        const tableauExpiresSec = toEpochSeconds(tableauToken?.expires);
        const shouldRefresh = tableauExpiresSec > 0 && (tableauExpiresSec - now) < 240;

        if (shouldRefresh && token.name && token.email) {
          console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Refreshing Tableau token for ${token.email}`);

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

          try {
            const session = new SessionModel(token.name as string);
            await session.jwt(token.email as string, embed_options, embed_scopes, rest_options, rest_scopes, token.uaf as any);

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

              token.tableau = {
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
              console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Successfully refreshed token, new expiry: ${expires}`);
            }
          } catch (error) {
            console.error(`[NextAuth JWT Callback] ${new Date().toISOString()} - Error refreshing token:`, error);
          }

          // Also refresh EACanada token if it exists
          const eacanadaToken = token.tableau_eacanada as any;
          const eacanadaExpiresSec = toEpochSeconds(eacanadaToken?.expires);
          const shouldRefreshEACanada = eacanadaExpiresSec > 0 && (eacanadaExpiresSec - now) < 240;
          if (shouldRefreshEACanada) {
            console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Refreshing EACanada token for ${token.email}`);

            const eacanada_jwt_client_id = process.env.EACANADA_JWT_CLIENT_ID;
            const eacanada_embed_secret = process.env.EACANADA_EMBED_JWT_SECRET;
            const eacanada_embed_secret_id = process.env.EACANADA_EMBED_JWT_SECRET_ID;
            const eacanada_rest_secret = process.env.EACANADA_REST_JWT_SECRET;
            const eacanada_rest_secret_id = process.env.EACANADA_REST_JWT_SECRET_ID;

            if (eacanada_jwt_client_id && eacanada_embed_secret && eacanada_rest_secret) {
              const eacanada_embed_options = {
                jwt_secret: eacanada_embed_secret,
                jwt_secret_id: eacanada_embed_secret_id,
                jwt_client_id: eacanada_jwt_client_id
              };
              const eacanada_rest_options = {
                jwt_secret: eacanada_rest_secret,
                jwt_secret_id: eacanada_rest_secret_id,
                jwt_client_id: eacanada_jwt_client_id
              };

              try {
                const eacanada_session = new SessionModel(token.name as string);
                await eacanada_session.jwtEACanada(token.email as string, eacanada_embed_options, embed_scopes, eacanada_rest_options, rest_scopes, token.uaf as any);

                if (eacanada_session.authorized) {
                  const {
                    user_id: eacanada_user_id,
                    embed_token: eacanada_embed_token,
                    rest_token: eacanada_rest_token,
                    rest_key: eacanada_rest_key,
                    site_id: eacanada_site_id,
                    site: eacanada_site,
                    created: eacanada_created,
                    expires: eacanada_expires
                  } = eacanada_session;

                  token.tableau_eacanada = {
                    username: (token.tableau as any)?.username || token.name,
                    user_id: eacanada_user_id,
                    embed_token: eacanada_embed_token,
                    rest_token: eacanada_rest_token,
                    rest_key: eacanada_rest_key,
                    site_id: eacanada_site_id,
                    site: eacanada_site,
                    created: eacanada_created,
                    expires: eacanada_expires
                  };
                  console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Successfully refreshed EACanada token, new expiry: ${eacanada_expires}`);
                }
              } catch (error) {
                console.error(`[NextAuth JWT Callback] ${new Date().toISOString()} - Error refreshing EACanada token:`, error);
              }
            }
          }

          // Also refresh UBL token if it exists
          const ublToken = token.tableau_ubl as any;
          const ublExpiresSec = toEpochSeconds(ublToken?.expires);
          const shouldRefreshUBL = ublExpiresSec > 0 && (ublExpiresSec - now) < 240;
          if (shouldRefreshUBL) {
            console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Refreshing UBL token for ${token.email}`);

            const ubl_jwt_client_id = process.env.UBL_JWT_CLIENT_ID;
            const ubl_embed_secret = process.env.UBL_EMBED_JWT_SECRET;
            const ubl_embed_secret_id = process.env.UBL_EMBED_JWT_SECRET_ID;
            const ubl_rest_secret = process.env.UBL_REST_JWT_SECRET;
            const ubl_rest_secret_id = process.env.UBL_REST_JWT_SECRET_ID;

            if (ubl_jwt_client_id && ubl_embed_secret && ubl_rest_secret) {
              const ubl_embed_options = {
                jwt_secret: ubl_embed_secret,
                jwt_secret_id: ubl_embed_secret_id,
                jwt_client_id: ubl_jwt_client_id
              };
              const ubl_rest_options = {
                jwt_secret: ubl_rest_secret,
                jwt_secret_id: ubl_rest_secret_id,
                jwt_client_id: ubl_jwt_client_id
              };

              // TEMP DISABLED for UAF debugging.
              const ubl_extra_claims_refresh: Record<string, unknown> = {
                'https://tableau.com/oda':"true",
                'https://tableau.com/groups': (token.groups as string[] | undefined) ?? [],
              };

              // Match the narrower scope set used at sign-in.
              const ubl_embed_scopes_refresh = [
                "tableau:views:embed",
                "tableau:views:embed_authoring",
              ];

              try {
                const ubl_session = new SessionModel(token.name as string);
                await ubl_session.jwtUBL(token.email as string, ubl_embed_options, ubl_embed_scopes_refresh, ubl_rest_options, rest_scopes, token.uaf as any, ubl_extra_claims_refresh);

                if (ubl_session.authorized) {
                  const {
                    user_id: ubl_user_id,
                    embed_token: ubl_embed_token,
                    rest_token: ubl_rest_token,
                    rest_key: ubl_rest_key,
                    site_id: ubl_site_id,
                    site: ubl_site,
                    created: ubl_created,
                    expires: ubl_expires
                  } = ubl_session;

                  token.tableau_ubl = {
                    username: (token.tableau as any)?.username || token.name,
                    user_id: ubl_user_id,
                    embed_token: ubl_embed_token,
                    rest_token: ubl_rest_token,
                    rest_key: ubl_rest_key,
                    site_id: ubl_site_id,
                    site: ubl_site,
                    created: ubl_created,
                    expires: ubl_expires
                  };
                  console.log(`[NextAuth JWT Callback] ${new Date().toISOString()} - Successfully refreshed UBL token, new expiry: ${ubl_expires}`);
                }
              } catch (error) {
                console.error(`[NextAuth JWT Callback] ${new Date().toISOString()} - Error refreshing UBL token:`, error);
              }
            }
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT; }) {
      const customSession = session as CustomSession;
      if (customSession.user) {
        customSession.user.demo = token.demo as string;
        customSession.user.salesforceUsername = token.salesforceUsername as string;
        // tableau_eacanada is stored in the JWT token and accessed via getToken() in API routes
        // No need to copy to session since API routes read directly from JWT
      }
      return session;
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}
