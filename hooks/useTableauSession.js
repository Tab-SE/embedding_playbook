import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMetrics } from "./useMetrics";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useTableauSession = async () => {
  const [user, setUser] = useState(undefined);
  const { status, data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // => This component should wrap all other Tableau components: https://next-auth.js.org/getting-started/client#require-session
      signIn();
    },
  });

  // query hooks, indexed by user
  const metrics = useMetrics(user);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(data.user.name);
    }
  }, [status, data]);

  if (Array.isArray(metrics)) {
    metrics.forEach((metric, index) => {
      console.log(index, metric);
      return {
        user: user,
        metrics: metrics,
      };
    });
  } else {
    return false;
  }
}