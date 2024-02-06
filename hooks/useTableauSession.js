import { useQuery } from "@tanstack/react-query";
import { getEmbed } from "../libs/requests";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries

export const useTableauSession = async (userId) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [userId].every(param => param != null) ? ["tableau", "embed", userId] : []; 

  return useQuery({
    queryKey: queryKey, 
    queryFn: () => {
      return getEmbed(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
