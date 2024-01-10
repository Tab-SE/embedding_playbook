import { useQuery, } from "@tanstack/react-query"
import { getSpringboard } from "../libs/requests"
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useSpringboard = async (user, metric) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [user].every(param => param != null) ? ["tableau", "insights", "springboard", metric.id, metric.name] : []; 

  return useQuery({
    queryKey: queryKey, 
    queryFn: async () => {
      if (!metric) {
        throw new Error("metric is required.");
      }
      return await getSpringboard(metric);
    },
    enabled: !!metric,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
