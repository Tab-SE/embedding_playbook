import { useQuery, useQueries } from "@tanstack/react-query";
import { createHash } from "crypto";
import { getMetricFiltersPrivate } from "libs";

/*
Request to metrics:getOrCreate looks like:
{
  "definition_id": "b2acf472-2517-4b5f-a30c-5352f318bbd1",
  "specification":
    { "filters": [
      { "field": "Category", "operator": "OPERATOR_EQUAL", "categorical_values": 
        [{ "string_value": "Office Supplies" }, { "string_value": "Technology" }] }, 
      { "field": "Region", "operator": "OPERATOR_EQUAL", "categorical_values": 
        [{ "string_value": "Central" }, { "string_value": "East" }] }], 
      "measurement_period": { "granularity": "GRANULARITY_BY_MONTH", "range": "RANGE_LAST_COMPLETE" }, "comparison": { "comparison": "TIME_COMPARISON_PREVIOUS_PERIOD" } }
};
*/

export const useMetricFilters = (metrics, filters) => {

  const hash = createHash("sha256");
  hash.update(JSON.stringify({ metrics, filters }));
  const base64Hash = metrics?.length && filters?.length ? hash.digest("base64") : [];

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["tableau", "metricGetOrCreate", "base64Hash", base64Hash],
    queryFn: async () => {
      let data = await getMetricFiltersPrivate(metrics, filters);
      // data.field = metric;
      return data;
    },
    enabled: !!(metrics && metrics.length) && !!(filters && filters.length),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })

};

/*
export const useMetricFilters = (definitionSpecifications:
  {
    definition_id: any;
    specification: {
      filters: {
        field: string;
        operator: string;
        categorical_values: {string_value: string}[];
      }[];
      measurement_period: any;
      comparison: any;
    }
  }[]) => {

  let queries: any[] = [];

  // if (definitionSpecifications) {   
     queries = definitionSpecifications ? definitionSpecifications?.map(defSpec => {
      return ({
        queryKey: ["tableau", "metricDefinition", defSpec.definition_id, ...defSpec?.specification?.filters?.flatMap(filter => {
          return ["field", filter.field, "categorical_values", [...filter?.categorical_values?.map(str => str.string_value)].toString()];
        })],
        queryFn: async () => {
          let data = await getMetricFiltersPrivate(defSpec);
          // data.field = metric;
          return data;
        },
        enabled: !!defSpec.definition_id,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(30 * 1.5 ** attemptIndex, 3000),
        staleTime: 30 * 60 * 1000, // 30 minutes
      })
    }) : [];
  // }
  console.log(`queries in useMetricFilters: ${JSON.stringify(queries)}`);
  const results = useQueries({ queries });

  let resultsMap = results?.map((result, index) =>
  ({
    status: result.status,
    data: result.data ? result.data : [],
    error: result.error,
  }));

  return resultsMap;

};
*/