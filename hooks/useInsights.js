import { useQuery, } from "@tanstack/react-query"
import { getInsights } from "../libs/requests"
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useInsights = async (user, metric, resources) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [user].every(param => param != null) ? ["tableau", "insights", metric.id, metric.name] : []; 

  return useQuery({
    queryKey: queryKey, 
    queryFn: async () => {
      if (!user) {
        throw new Error("user is required.");
      }
      return await getInsights(metric, resources);
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
