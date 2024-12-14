"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTableauSession } from "hooks";
import { getMetrics } from "libs";

export const useMetrics = () => {
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession('a', 'superstore');

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [user?.name].every(param => param != null) ? ["tableau", user.name, "metrics"] : [];

  const query = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      return getMetrics();
    },
    enabled: !!user,
    retry: 3,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  return query;
}
