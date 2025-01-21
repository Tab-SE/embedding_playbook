import { useQuery, useQueries } from "@tanstack/react-query";
import { getDatasourceFieldsPrivate } from "libs";
import { endianness } from "os";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries



export const useDatasourceFields = (datasourceFields: { datasourceId: string, fields: string[] }[], showPulseFilters: 'true'|'false') => {

  const flatMap = datasourceFields.length ? datasourceFields?.map(({ datasourceId, fields }) =>
    fields.map(field => ({
      datasourceId,
      field,
    })
    )).flat() || [] : [];


  const queries =
    datasourceFields.length ? datasourceFields?.map(({ datasourceId, fields }) =>
      fields.map(field => ({
        queryKey: ["tableau", "datasources", datasourceId, "fields", field],
        queryFn: async () => {
          if (!datasourceId) return {};
          let data = await getDatasourceFieldsPrivate(datasourceId, field);
          data.field = field;
          data.datasourceId = datasourceId;
          return data;
        },
        enabled: !!datasourceId && !!field && showPulseFilters === 'true',
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
        staleTime: 30 * 60 * 1000, // 30 minutes
      })
    )).flat() || []: [];

  const results = useQueries({ queries });
  const isLoading = results.some(result => result.isLoading);

  if (isLoading) {
    // Return a loading state or null while the queries are still pending
    return [];
  }
  let resultsMap: FieldResult[] = results.map((result, index) => ({
    status: result.status,
    data: result.data ?? [],
    error: result.error,
  }));



  return resultsMap;
}

