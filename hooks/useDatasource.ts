import { useQuery } from "@tanstack/react-query";
import { getDatasourcePrivate } from "libs";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries

export const useDatasource = (datasourceId: string) => {
  // set to an empty array if enumerated function parameters are not available in array
  const queryKey = [datasourceId].every(ds => ds != null) ? ["tableau", "datasources", datasourceId] : [];

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKey,
    queryFn: () => {
      if (!datasourceId) return {};
      return getDatasourcePrivate(datasourceId);
    },
    enabled: !!datasourceId,
    retry: 9,
    retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
    staleTime: 30 * 60 * 1000, // 30 minutes
    // cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
