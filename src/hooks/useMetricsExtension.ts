import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useTableauSessionExtension } from "hooks";
import { getMetrics } from "libs";
import { useTimeout } from "./useTimeout";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useMetricsExtension = (userName: string, loginData: any) => {
  const queryClient = useQueryClient();
  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading,
    signInError
  } = useTableauSessionExtension(userName, loginData);

  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [user?.name].every(param => param != null) ? ["tableau", user.name, "metrics"] : [];

  const metricsQuery = useQuery({
    queryKey: queryKey,
    queryFn: () => {
      return getMetrics();
    },
    enabled: !!user,
    retry: 3,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });


  // Use the useTimeout hook to invalidate the query after a delay
  useTimeout(() => {
    if (metricsQuery.isLoading || metricsQuery.isPending) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, 10000); // Adjust the delay as necessary (e.g., 10000ms = 10 seconds)

  return { ...metricsQuery, signInError };
}
