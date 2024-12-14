import { useQuery } from "@tanstack/react-query"
import { useTableauSessionExtension } from "hooks";
import { getMetricPrivate } from "libs"
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useMetric = (userName:string, loginData: any, specification_id = "") => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = ["tableau", "metric", userName, specification_id];

    // tanstack query hook to safely represent users on the client
    const {
      status: sessionStatus,
      data: user,
      error: sessionError,
      isSuccess: isSessionSuccess,
      isError: isSessionError,
      isLoading: isSessionLoading
    } = useTableauSessionExtension(userName, loginData);

  return useQuery({
    queryKey: queryKey, 
    queryFn: () => {
      return getMetricPrivate(specification_id);
    },
    enabled: !!user && !!specification_id,
    retry: 3,
    staleTime: 30 * 60 * 1000, // 30 minutes
    //cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
