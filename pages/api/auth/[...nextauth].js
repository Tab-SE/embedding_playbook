import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from 'axios'

const { 
  NEXTAUTH_SECRET,
  TABLEAU_DOMAIN,
  TABLEAU_API, 
  TABLEAU_SITE, 
  TABLEAU_PAT_NAME, 
  TABLEAU_PAT_SECRET,
  PULSE_DOMAIN,
  PULSE_API,
  PULSE_SITE,
  PULSE_PAT_NAME,
  PULSE_PAT_SECRET,
  GITHUB_ID, 
  GITHUB_SECRET 
} = process.env;

export const authOptions = {
  // Configure one or more authentication providers https://next-auth.js.org/configuration/initialization#api-routes-pages
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Demo User',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Mackenzie Day" },
        email: { label: "Username", type: "text", placeholder: "mackenzie.day@superstore.com" },
        password: { label: "Password", type: "password", placeholder: "p@ssword" },
        id: { label: "ID", type: "text", placeholder: "A" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        console.log('credentials', credentials, 'req', req);

        

        const getTableauAPIKey = async () => {
          try {
            const apiKey = await axios.post(`${TABLEAU_DOMAIN}/api/${TABLEAU_API}/auth/signin`, {
              personalAccessTokenName: TABLEAU_PAT_NAME,
              personalAccessTokenSecret: TABLEAU_PAT_SECRET,
              site: {
                contentUrl: TABLEAU_SITE,
              }
            });
            return apiKey;
          } catch (err) {
            return null
          }
        }

        const getPulseAPIKey = async () => {
          try {
            const apiKey = await axios.post(`${PULSE_DOMAIN}/api/${PULSE_API}/auth/signin`, {
              personalAccessTokenName: PULSE_PAT_NAME,
              personalAccessTokenSecret: PULSE_PAT_SECRET,
              site: {
                contentUrl: PULSE_SITE,
              }
            });
            return apiKey;
          } catch (err) {
            return null
          }
        }

        const signJWT = async () => {
          return true;
        }

        const tableauAPIKey = await getTableauAPIKey();
        const pulseAPIKey = await getPulseAPIKey();
        const JWT = await signJWT();

        return {
          tableauAPIKey: tableauAPIKey,
          pulseAPIKey: pulseAPIKey,
          JWT: JWT
        };
      }
    }),
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid
    maxAge: 2 * 60 * 60, // 2 hrs to match Tableau https://help.tableau.com/current/online/en-us/to_security.htm#user-security
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    // maxAge: 60 * 60 * 24 * 30,
    // You can define your own encode/decode functions for signing and encryption
    async encode() {},
    async decode() {},
  },
  callbacks: {
    // documented here: https://next-auth.js.org/configuration/callbacks
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  },
  debug: process.env.NODE_ENV = 'development' ? true : false,
}

export default NextAuth(authOptions)
