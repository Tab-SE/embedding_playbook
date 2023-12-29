import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import Session from "../../../utils/Session"
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
          sesh = new Session(credentials.username);
          await sesh.authorize();
          if (sesh.authorized) {
            user.rest = sesh.rest;
          }
          return sesh.authorized ? user : false; // Return false to display a default error message
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
    async jwt({ token, account, profile, user }) {
      // console.count('jwt runs');
      // console.log('user', user);
      // console.log('token', token);
      // persist metadata added to user object in authorize() callback to the JWT as claims
      if (user) {
        token.picture = user.picture;
        token.uaf = user.UAF;
        token.rest = user.rest;
      }
      return token
    },
    async session({ session, token, user }) {
      // database sessions pass user, JWT sessions pass token
      // console.count('session runs');
      // console.log('session', session);
      // console.log('token', token);
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development' ? true : false,
}

export default NextAuth(authOptions)
