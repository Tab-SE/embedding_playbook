import { useSession, signIn, signOut } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmbed, tabSignOut } from "../libs";


// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session

export const useTableauSession = (userName: string, loginData) => {
  // const queryClient = useQueryClient();

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userName].every((param) => param != null)

    ? ["tableau", "embed", userName]
    : [];
  const { data: session_data, status: session_status, update  } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // const { error, status, ok } = await signIn("demo-user", {
      const res = await signIn("demo-user", {
        redirect: false,
        ID: userName,
        ...loginData,
      });
      console.log(`sign in response: ${JSON.stringify(res, null, 2)}`);
      console.log(`...session status: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`)
    },
  });

  // controls dependent query
  const signedIn = session_status === "authenticated";
  console.log(`session status: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`)
  
    // return `session status: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`
  
  // tanstack query hook
  return useQuery({
    // TODO - missing property?
    // eslint-disable-next-line @tanstack/query/exhaustive-deps 
    queryKey: queryKey,
    queryFn: () => {
      return getEmbed(session_data?.user?.email); // TODO
    },
    enabled: signedIn,
    // cacheTime: Infinity, // caches embed token without garbage collection, refresh via auth error handler  TODO - doesn't exist?
    staleTime: Infinity,
    throwOnError: (error)=>{
      console.log(`error in tanstack query: ${error}`);
      return true;
    },
  });
};



