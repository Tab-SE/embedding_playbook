import NextAuth from "next-auth"
import { CredentialsProvider, GithubProvider } from "next-auth/providers/github"

const { 
  TABLEAU_DOMAIN,
  TABLEAU_API, 
  TABLEAU_SITE, 
  TABLEAU_PAT_NAME, 
  TABLEAU_PAT_SECRET,
  NEXTAUTH_SECRET, 
  GITHUB_ID, 
  GITHUB_SECRET 
} = process.env;

export const authOptions = {
  // Configure one or more authentication providers https://next-auth.js.org/configuration/initialization#api-routes-pages
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'User',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Mackenzie Day" },
        email: { label: "Username", type: "text", placeholder: "mackenzie.day@superstore.com" },
        password: { label: "Password", type: "password", placeholder: "p@ssword" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(`${TABLEAU_DOMAIN}/api/${TABLEAU_API}/auth/signin`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json();
  
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    }),
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
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
  
}

export default NextAuth(authOptions)
