"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "libs";

interface CustomSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    demo?: string;
  }
}

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session
export const useTableauSession = (demo?: string) => {
  const { status: session_status, data: session_data } = useSession({ required: false });

  // controls dependent query
  const signedIn = session_status === 'authenticated';
  const user_data = session_data as CustomSession;

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = signedIn ? ["tableau", "user session", user_data?.user?.name, user_data?.user?.demo ] : [];

  // tanstack query hook
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) {
        console.log('session_data', session_data);
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
