import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useTableauSession = async () => {
  const [user, setUser] = useState(undefined);
  const [authenticated, setAuthenticated] = useState(false);
  const { status, data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // => This component should wrap all other Tableau components: https://next-auth.js.org/getting-started/client#require-session
      const { error, status, ok } = await signIn('demo-user', { redirect: false, ID: 'a' });
      if (ok) {
        setAuthenticated(true);
      }
    }
  });

  return authenticated;
}



