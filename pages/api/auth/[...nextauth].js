import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"
import rls from "../../../rls.json"

// environment variables
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
        for (const [key, value] of Object.entries(rls.users)) { // check all keys in rls.json user store
          if (key.toUpperCase() === credentials.ID.toUpperCase()) { // find keys that match credential
            user = value; // if a match is found store value as user
            user.what = Math.random();

          }
        }

        if (user) {
          return user;
        } else {
          return false;
        }
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
    async signIn({ user, account, credentials }) {
      // console.log('user', user);
      // console.log('account', account);
      // console.log('credentials', credentials);

      let isAllowedToSignIn = false;

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
              this.rest[key] = config;
            } catch (err) {
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

      // console.log('sesh', sesh);
      // console.log('sesh.authorized', sesh.authorized);

      if (sesh.authorized) {
        isAllowedToSignIn = true;
      }

      return sesh.authorized ? sesh : false; // Return false to display a default error message
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async jwt({ token, account, profile, user }) {
      // Persist the OAuth access_token to the token right after signin
      console.count('jwt runs');
      console.log('token', token);
      console.log('account', account);
      console.log('profile', profile);
      console.log('user', user);

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
