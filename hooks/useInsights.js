import { useQuery } from "@tanstack/react-query"
import { getInsights } from "../libs/requests"
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries

export const useInsights = (metric) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [metric].every(param => param != null) ? ["tableau", "insights", metric.name, metric.id] : []; 

  return useQuery({
    queryKey: queryKey, 
    queryFn: () => {
      return getInsights(metric);
    },
    enabled: !!metric,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
