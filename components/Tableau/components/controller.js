import { useQuery, } from "@tanstack/react-query"
// tanstack query keys structured as recommended by tkdodo: https://tkdodo.eu/blog/effective-react-query-keys#structure

// manages filter state
export const useFilters = async (activeSheet) => {
  // enables dependent queries: https://tanstack.com/query/v3/docs/react/guides/dependent-queries
  const active = !activeSheet ? false : true;

  let filters = [];

  async function syncFilters() {
    console.log('sheet', activeSheet);
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (sheet) {
      try {
        return filters = await activeSheet.getFiltersAsync();

        // // show # and names of categorical filters in the Console
        // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);
        // nonCategoricalFilters = dashFilters.filter((df) => df.filterType !== FilterType.Categorical);

        // console.log(`The number of categorical filters: ${filter.length} 
        // Filters: ${filter.map((s) => s.fieldName)}`);
        // console.log('Available categorical dashboard filters:', filter);
        
      } catch (e) {
        console.error(e.toString());
      };
    }
  };

  const result = useQuery({
    queryKey: ['viz', 'filters'],
    queryFn: () => syncFilters(),
    enabled: active,
    placeholderData: [],
    initialData: []
  });

  return !active ? null : result;
}
