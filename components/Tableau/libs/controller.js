import { useQuery, } from "@tanstack/react-query"
import { useState, useEffect } from "react";
// implements custom hooks with tanstack query for asynchronous state management of Tableau
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useFilters = async (activeSheet, id) => {
  const active = !activeSheet ? false : true;

  async function syncFilters() {
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (activeSheet) {
      try {
        return await activeSheet.getFiltersAsync();
      } catch (e) {
        console.error(e.toString());
      };
    }
  };

  // show # and names of categorical filters in the Console
  // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);
  // nonCategoricalFilters = dashFilters.filter((df) => df.filterType !== FilterType.Categorical);

  return useQuery({
    queryKey: ['tableau', 'viz', 'filters', id],
    queryFn: async () => await syncFilters(),
    enabled: active,
  });
}
