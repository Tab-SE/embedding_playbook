import { useSession, signIn } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getEmbed } from "../libs/requests";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries

export const useTableauSession = async (userName) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userName].every(param => param != null) ? ["tableau", "embed", userName] : []; 

  const { status, data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // => This component should wrap all other Tableau components: https://next-auth.js.org/getting-started/client#require-session
      const { error, status, ok } = await signIn('demo-user', { redirect: false, ID: userName });
      if (ok) {
        console.log('ok');
      }
    }
  });

  console.log('data', data);

  return useQuery({
    queryKey: queryKey, 
    queryFn: () => {
      return getEmbed(userName);
    },
    enabled: status === "authenticated",
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
