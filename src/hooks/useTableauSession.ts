"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/libs";
import { CustomSession } from "@/types";

// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries
// secures UI components via these methods: https://next-auth.js.org/getting-started/client#require-session
export const useTableauSession = () => {
  const { status: session_status, data: session_data } = useSession({ required: false });

  // controls dependent query
  const signedIn = session_status === 'authenticated';
  const user_data = session_data as CustomSession;

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = signedIn ? ["tableau", "user session", user_data?.user?.name, user_data?.user?.demo ] : [];

  // tanstack query hook
  const result = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: async () => {
      const timestamp = new Date().toISOString();
      const email = session_data?.user?.email;
      if (!email) {
        throw new Error("useTableauSession Error: Session data not available");
      }
      console.log(`[useTableauSession] ${timestamp} - Fetching new token for ${email}`);
      const clientSession = await getClientSession(email);
      console.log(`[useTableauSession] ${timestamp} - Got token:`, clientSession?.embed_token?.substring(0, 50) + '...');
      return clientSession;
    },
    enabled: signedIn,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes (before token expires)
    gcTime: Infinity, // Keep in cache but mark as stale
    refetchInterval: 5 * 60 * 1000, // Automatically refetch every 5 minutes to get fresh tokens
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Log when data changes
  useEffect(() => {
    if (result.data?.embed_token) {
      const timestamp = new Date().toISOString();
      console.log(`[useTableauSession] ${timestamp} - Token updated in hook:`, result.data.embed_token.substring(0, 50) + '...');
    }
  }, [result.data?.embed_token]);

  return result;
}

// Helper function to fetch client session
const getClientSession = async (userEmail: string | undefined) => {
  if (!userEmail) throw new Error("User email is required to fetch client session");
  const clientSafeUser = await getUser(userEmail);
  return clientSafeUser;
};
