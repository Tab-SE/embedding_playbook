"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

import { getUserEP } from "@/libs";
import { CustomSession } from "@/types";

export const useTableauSessionEP = () => {
  const { status: session_status, data: session_data } = useSession({ required: false });

  const signedIn = session_status === 'authenticated';
  const user_data = session_data as CustomSession;

  const queryKey = signedIn ? ["tableau", "ep", "user session", user_data?.user?.name, user_data?.user?.demo] : [];

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (session_data?.user?.email) {
        return getClientSessionEP(session_data.user.email);
      } else {
        throw new Error("useTableauSessionEP Error: Session data not available");
      }
    },
    enabled: signedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity,
    refetchInterval: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

const getClientSessionEP = async (userEmail: string | undefined) => {
  if (!userEmail) throw new Error("User email is required to fetch client session");
  return getUserEP(userEmail);
};
