import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

const {
  NODE_ENV, 
  NEXTAUTH_SECRET,
  TABLEAU_DOMAIN, TABLEAU_API, TABLEAU_SITE, TABLEAU_PAT_NAME, TABLEAU_PAT_SECRET,
  PULSE_DOMAIN, PULSE_API, PULSE_SITE, PULSE_PAT_NAME, PULSE_PAT_SECRET,
  GITHUB_ID, GITHUB_SECRET 
} = process.env;

const REST = {
  tableau: {
    domain: TABLEAU_DOMAIN,
    api: TABLEAU_API, 
    site: TABLEAU_SITE, 
    pat_name: TABLEAU_PAT_NAME, 
    pat_secret: TABLEAU_PAT_SECRET,
  },
  pulse: {
    domain: PULSE_DOMAIN,
    api: PULSE_API, 
    site: PULSE_SITE, 
    pat_name: PULSE_PAT_NAME, 
    pat_secret: PULSE_PAT_SECRET,
  }
}

export const authOptions = {
  // Configure one or more authentication providers https://next-auth.js.org/configuration/initialization#api-routes-pages
  providers: [
    CredentialsProvider({
      id: 'demo-user',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Demo User',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Mackenzie Day" },
        email: { label: "Email", type: "text", placeholder: "mday@superstore.com" },
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

        // console.log('credentials', credentials, 'req', req);

        class Session {
          constructor(username) {
            this.authorized = false;
            this.username = username;
            this.embed = false;
            this.rest = {};
          }

          getRest = async (rest) => {
            for (const [key, value] of Object.entries(rest)) {
              try {
                // console.log(`AUTH ATTEMPT: ${key}`, value);
                const res = await axios.post(`${value.domain}/api/${value.api}/auth/signin`, {
                  credentials: {
                    personalAccessTokenName: value.pat_name,
                    personalAccessTokenSecret: value.pat_secret,
                    site: {
                      contentUrl: value.site,
                    }
                  }
                });
                const { site, user, token, estimatedTimeToExpiration } = res.data.credentials;
                const config = { key: token, site: site.id, user: user.id, expires: estimatedTimeToExpiration };
                console.log(`AUTH SUCCESS! ${key}`, config);
                this.rest[key] = config;
              } catch (err) {
                console.error(`AUTH ERROR! ${key}`, err.response.data);
                this.rest[key] = { error: err.response.data };
              }
            }
          }

          getEmbed = async (rest) => {
            this.embed = true;
          }

          authorize = async (rest) => {
            const errors = new Array;
            await this.getRest(rest);
            await this.getEmbed(rest);
            // loops through rest objects to find error entries
            for (const [auth, result] of Object.entries(this.rest)) {
              for (const [key, value] of Object.entries(result)) {
                if (key === 'error') {
                  value.method = auth;
                  errors.push(value); // adds error to array indicating method
                }
              }
            }
            if (errors.length === 0) { // if no errors are found then authorize the user
              this.authorized = true;
            }
          }
        }

        const sesh = new Session(credentials.username);
        await sesh.authorize(REST);

        console.log('sesh', sesh);

        return sesh.authorized ? sesh : null;
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
  debug: NODE_ENV === 'development' ? true : false,
}

export default NextAuth(authOptions)
