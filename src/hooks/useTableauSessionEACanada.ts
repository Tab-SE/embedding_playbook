"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUserEACanada } from "@/libs";
import { CustomSession } from "@/types";

// implements custom hooks with tanstack query for asynchronous state management
// for eacanada Tableau server authentication - follows same pattern as useTableauSession
export const useTableauSessionEACanada = () => {
  const { status: session_status, data: session_data } = useSession({ required: false });

  // controls dependent query
  const signedIn = session_status === 'authenticated';
  const user_data = session_data as CustomSession;

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = signedIn ? ["tableau", "eacanada", "user session", user_data?.user?.name, user_data?.user?.demo ] : [];

  // tanstack query hook
  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) {
        return getClientSessionEACanada(session_data.user.email);
      } else {
        throw new Error("useTableauSessionEACanada Error: Session data not available");
      }
    },
    enabled: signedIn,
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes (before token expires)
    gcTime: Infinity, // Keep in cache but mark as stale
    refetchInterval: 5 * 60 * 1000, // Automatically refetch every 5 minutes to get fresh tokens
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });
}

// Helper function to fetch client session for eacanada
const getClientSessionEACanada = async (userEmail: string | undefined) => {
  if (!userEmail) throw new Error("User email is required to fetch client session");
  const clientSafeUser = await getUserEACanada(userEmail);
  return clientSafeUser;
};

