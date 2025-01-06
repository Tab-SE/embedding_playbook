"use client"
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

export const useTableauSessionExtension = (userName: string, loginData: any) => {
  const [signInError, setSignInError] = useState<string | null>(null);

  const { data: session_data, status: session_status, update } = useSession({
    required: true,
    async onUnauthenticated() {
      try {
        const res = await signIn("extension-user", {
          redirect: false,
          ID: userName,
          ...loginData,
        });
        if (res?.error) {
          setSignInError(res.error);
        }
        else {
          setSignInError(null);
        }
        /*
        // this used to work, but now process isn't available
        if (process && process.env?.NEXT_PUBLIC_DEBUG || process.env?.NEXT_PUBLIC_DEBUG?.toLowerCase() === 'true') {
          console.log(`sign in response in onUnauthenticated: ${JSON.stringify(res, null, 2)}`);
          console.log(`...session status in onUnauthenticated: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`);
        }
          */
      } catch (error) {
        setSignInError(`Sign-in failed. Please check your credentials and try again. \r\r ${error}`);
      }
    },
  });

  const signedIn = session_status === "authenticated";
  if (process?.env?.DEBUG?.toLowerCase() === "true") {
    console.log(`session status in signedIn: ${session_status} and session_data ${JSON.stringify(session_data, null, 2)}`);
  }
  const query = useQuery({
    queryKey: ["tableau", "embed", userName, session_data?.user?.email || (session_data && session_data.user && session_data.user.email)],
    queryFn: () => {
      if (session_data?.user?.email) return getClientSession(session_data.user.email);
    },
    enabled: signedIn,
    staleTime: Infinity,
  });

  return { ...query, signInError };
};

const getClientSession = async (userEmail) => {
  const clientSafeUser = await getUser(userEmail);
  return clientSafeUser;
};

