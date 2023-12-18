// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries
import { useQuery, } from "@tanstack/react-query"
import { getMetrics } from "./utils/rest"

export const useMetrics = async (user_id) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [user_id].every(param => param != null) ? ["tableau", "metrics", user_id] : []; 

  return useQuery({
    queryKey: queryKey, 
    queryFn: async () => {
      if (!user_id) {
        throw new Error("User ID is required.");
      }
      return await getMetrics();
    },
    enabled: !!user_id,
  });
}
