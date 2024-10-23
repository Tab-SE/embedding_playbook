import { DataSource } from "@tableau/extensions-api-types";
import { useQueries } from "@tanstack/react-query";
import { getDatasourcePrivate } from "libs";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries

export const useDatasource = (datasourceIds: string[]) => {
  // set to an empty array if enumerated function parameters are not available in array
  
  const queries = datasourceIds.length ? datasourceIds.map(datasourceId => ({
    queryKey: ["tableau", "datasources", datasourceId],
    queryFn: async () => {
      if (!datasourceId) return {};
      let data = await getDatasourcePrivate(datasourceId);
      return data;
    },
    enabled: !!datasourceId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
    staleTime: 30 * 60 * 1000, // 30 minutes


  })) : [];
  
  const results = useQueries({ queries });
  const isLoading = results.some(result => result.isLoading);

  if (isLoading) {
    // Return a loading state or null while the queries are still pending
    return [];
  }
  let resultsMap:{ status: "error" | "success" | "pending"; data: ExtendedDatasource; error: Error | null; }[] = results.map((result, index) => ({
    status: result.status,
    data: result.data ?? [],
    error: result.error,
  }));
  return resultsMap;
}
