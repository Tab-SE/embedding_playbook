import { useSession, signIn } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "libs";

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session
export const useTableauSession = (userName, demo) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userName].every(param => param != null) ? ["tableau", "user session",  userName] : [];

  const { status: session_status, data: session_data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      const { error, status, ok } = await signIn('demo-user', { redirect: false, ID: userName, demo: demo });
    }
  });

  // controls dependent query
  const signedIn = session_status === 'authenticated';

  // tanstack query hook
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      return getClientSession(session_data.user.email);
    },
    enabled: signedIn,
    cacheTime: Infinity, // caches embed token without garbage collection, refresh via auth error handler
  });
}

const getClientSession = async (userEmail) => {
  const clientSafeUser = await getUser(userEmail);
  return clientSafeUser;
}
