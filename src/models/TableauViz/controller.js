// eslint-disable-next-line no-unused-vars
import { tab_embed } from '../../libs';
import { useQuery, } from "@tanstack/react-query";
// implements custom hooks with tanstack query for asynchronous state management of Tableau
// concepts described here: https://tkdodo.eu/blog/react-query-as-a-state-manager
// more on query key structure: https://tkdodo.eu/blog/effective-react-query-keys#structure
// more on dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries

export const useFilters = (activeSheet, id) => {
  const active = !activeSheet ? false : true;

  async function syncFilters() {
    if (activeSheet) {
      try {
        return await activeSheet.getFiltersAsync();
      } catch (e) {
        console.error(e.toString());
      };
    }
  };

  return useQuery({
    queryKey: ['tableau', 'viz', 'filters', id],
    queryFn: syncFilters,
    enabled: active,
  });
}

