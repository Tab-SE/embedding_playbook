import { useQuery, useQueries } from "@tanstack/react-query";
import { getDatasourceFieldsPrivate } from "libs";
import { endianness } from "os";
// implements custom hooks with tanstack query for asynchronous state management
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v5/docs/framework/react/guides/dependent-queries
// more on retries (default 3): https://tanstack.com/query/v5/docs/framework/react/guides/query-retries



export const useDatasourceFields = (datasourceId: string, fields: string[]) => {
  
  const queries = fields.map(field => ({
    queryKey: ["tableau", "datasources", datasourceId, "fields", field],
    queryFn: async () => {
      if (!datasourceId) return {};
      let data = await getDatasourceFieldsPrivate(datasourceId, field);
      data.field = field;
      return data;
    },
    enabled: !!datasourceId && !!field,
    retry: 3, 
    retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
    staleTime: 30 * 60 * 1000, // 30 minutes
  }));

  const results = useQueries({ queries });

  let resultsMap = results.map((result, index) => ({
    field: fields[index],
    status: result.status,
    data: result.data ? result.data.categorical_values : [],
    error: result.error,
  }));

  return resultsMap;
}


interface FieldData {
  field?: string;
  categorical_values: {
    values: string[];
  };
  next_page_token?: string;
  total_available?: number;
}