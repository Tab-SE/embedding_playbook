"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUserUBL } from "@/libs";
import { CustomSession } from "@/types";

// implements custom hooks with tanstack query for asynchronous state management
// for ubl Tableau server authentication - follows same pattern as useTableauSession
export const useTableauSessionUBL = () => {
  const { status: session_status, data: session_data } = useSession({ required: false });

  // controls dependent query
  const signedIn = session_status === 'authenticated';
  const user_data = session_data as CustomSession;

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = signedIn ? ["tableau", "ubl", "user session", user_data?.user?.name, user_data?.user?.demo ] : [];

  // tanstack query hook
  const query = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) {
        return getClientSessionUBL(session_data.user.email);
      } else {
        throw new Error("useTableauSessionUBL Error: Session data not available");
      }
    },
    enabled: signedIn,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes (before token expires)
    gcTime: Infinity, // Keep in cache but mark as stale
    refetchInterval: 5 * 60 * 1000, // Automatically refetch every 5 minutes to get fresh tokens
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Local debug: log UBL JWTs to the browser console with cmd+click-able jwt.io URLs.
  // Fires on every mount where data is available (cache hit OR fresh fetch).
  // Strip before deploy.
  const embedToken = query.data?.embed_token;
  const restToken = query.data?.rest_token;
  useEffect(() => {
    if (embedToken) {
      console.log('[UBL] embed jwt: https://jwt.io/?token=' + embedToken);
    }
    if (restToken) {
      console.log('[UBL] rest  jwt: https://jwt.io/?token=' + restToken);
    }
  }, [embedToken, restToken]);

  return query;
}

// Helper function to fetch client session for ubl
const getClientSessionUBL = async (userEmail: string | undefined) => {
  if (!userEmail) throw new Error("User email is required to fetch client session");
  const clientSafeUser = await getUserUBL(userEmail);
  return clientSafeUser;
};
