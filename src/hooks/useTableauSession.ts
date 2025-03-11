"use client";

import { useSession, signIn, SignInOptions } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "libs";

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session
export const useTableauSession = () => {

  // set to an empty array if enumerated function parameters are not available in array
  // const queryKey = [user_id].every(param => param != null) ? ["tableau", "user session",  user_id, demo] : [];
  const queryKey = ["tableau", "user session"];

  // const { status: session_status, data: session_data } = useSession({
  //   required: true, // if true only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
  //   async onUnauthenticated() {
  //     if (user_id && demo) {
  //       // Handle unauthenticated state
  //       const signInResponse = await signIn("demo-user", {
  //         redirect: false,
  //         ID: user_id,
  //         demo: demo,
  //       } as SignInOptions);

  //       if (signInResponse) {
  //         const { error, status, ok } = signInResponse;

  //         if (!ok) {
  //           console.error("Sign-in failed:", error);
  //           throw new Error(`Sign-in failed with status ${status}`);
  //         }
  //       } else {
  //         console.error("Sign-in response is undefined");
  //       }
  //     } else {
  //       console.warn("User ID or demo is missing. Cannot sign in.");
  //     }
  //   }
  // });

  const { status: session_status, data: session_data } = useSession({ required: true });

  // controls dependent query
  const signedIn = session_status === 'authenticated';

  // tanstack query hook
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) {
        return getClientSession(session_data.user.email);
      } else {
        throw new Error("Error: Session data not available");
      }
    },
    enabled: signedIn,
    gcTime: Infinity, // caches embed token without garbage collection, refresh via auth error handler
  });
}

// Helper function to fetch client session
const getClientSession = async (userEmail: string | undefined) => {
  if (!userEmail) throw new Error("User email is required to fetch client session");
  const clientSafeUser = await getUser(userEmail);
  return clientSafeUser;
};
