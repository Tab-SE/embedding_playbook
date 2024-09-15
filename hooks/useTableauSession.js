import { useSession, signIn } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "libs";

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session
export const useTableauSession = (userName) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userName].every(param => param != null) ? ["tableau", "embed", userName] : [];

  const { status: session_status, data: session_data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      const { error, status, ok } = await signIn('demo-user', { redirect: false, ID: userName });
    }
  });

  // controls dependent query
  const signedIn = session_status === 'authenticated';

  // tanstack query hook
  return useQuery({
    queryKey: queryKey,
    queryFn: () => {
      return getClientSession(session_data.user.email);
    },
    enabled: signedIn,
    cacheTime: Infinity, // caches embed token without garbage collection, refresh via auth error handler
  });
}

const getClientSession = async (userEmail) => {
  const { name, email, picture, tableau } = await getUser(userEmail);
  const { user_id, embed_token, site, created, expires  } = tableau;
  // form a payload to safely represent the user on the client
  const clientSession = {
    name: name,
    email: email,
    picture: picture,
    user_id: user_id,
    embed_token: embed_token,
    site: site,
    created: created,
    expires: expires
  };

  return clientSession;
}
