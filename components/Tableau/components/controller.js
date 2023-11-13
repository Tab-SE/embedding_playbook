// eslint-disable-next-line no-unused-vars
import tab_embed from '../../embed_api/embed_api'
import { useQuery, } from "@tanstack/react-query"
// tanstack query keys structured as recommended by tkdodo: https://tkdodo.eu/blog/effective-react-query-keys#structure

// manages filter state
export const useCategoricalFilter = async (active) => {
  let categoricalFilters;

  const syncFilters = async () => {
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (active) {
      try {
        console.log('active', active);
        // const dashFilters = await active.getFiltersAsync();
        // // show # and names of categorical filters in the Console
        // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);

        // console.log(`The number of categorical filters: ${categoricalFilters.length}
        // Filters: ${categoricalFilters.map((s) => s.fieldName)}`);
        // console.log('Available categorical dashboard filters:', categoricalFilters);
        
        // return categoricalFilters;

        return [];
      } catch (e) {
        console.error(e.toString());
      };
    } else {
      return [];
    }
  };

  useQuery({
    queryKey: ['viz', 'filters', active],
    queryFn: syncFilters(),
  });
}
