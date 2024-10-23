import { useSession, signIn, signOut, getProviders } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, tabSignOut } from "../libs";
// import getConfig from 'next/config';
import { useState, useEffect, useContext } from 'react';

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session

export const useTableauSessionExtension = (userName: string, loginData) => {
  // const queryClient = useQueryClient();
  // const { publicRuntimeConfig } = getConfig();
  // const { basePath } = publicRuntimeConfig;
  const basePath = process.env.NEXT_PUBLIC_BASE_URL;
  const basePathUrl = `/pulseExtension/api/auth`;
  // const basePathUrl = `${basePath}/api/auth`;
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userName].every((param) => param != null)

    ? ["tableau", "embed", userName]
    : [];
  const { data: session_data, status: session_status, update  } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    async onUnauthenticated() {
      // The user is not authenticated, handle it here.

      const res = await signIn("demo-user", {
        redirect: false,
        ID: userName,
        basePath: '/pulseExtension/api/auth',
        ...loginData,
      });
      console.log(`sign in response in onUnauthenticated: ${JSON.stringify(res, null, 2)}`);
      console.log(`...session status in onUnauthenticated: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`)
    },
  });

  // useEffect(() => {
  //   console.log("useTableauSession Session data:", session_data);
  //   console.log("useTableauSession Session status:", session_status);
  //   console.log(`useTableauSession Basepathurl: ${basePathUrl}`);
  // }, [session_data, session_status]);

  // controls dependent query
  const signedIn = session_status === "authenticated";
  console.log(`session status in signedIn: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`)
  
  // tanstack query hook
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps 
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) return getClientSession(session_data.user.email);
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

const getClientSession = async (userEmail) => {
  const clientSafeUser = await getUser(userEmail);
  return clientSafeUser;
}

