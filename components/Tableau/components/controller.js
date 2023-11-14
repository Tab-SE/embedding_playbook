import { useQuery, } from "@tanstack/react-query"
import filterList from '../../toolbar/components/filters/components/filterList'
// tanstack query keys structured as recommended by tkdodo: https://tkdodo.eu/blog/effective-react-query-keys#structure

// manages filter state
export const useCategoricalFilter = async (active) => {
  let categoricalFilters;

  async function syncFilters(sheet) {
    console.log('sheet', sheet);
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (sheet) {
      try {
        // const dashFilters = await sheet.getFiltersAsync();
        // console.log(dashFilters);
        // show # and names of categorical filters in the Console
        // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);

        // console.log(`The number of categorical filters: ${categoricalFilters.length}
        // Filters: ${categoricalFilters.map((s) => s.fieldName)}`);
        // console.log('Available categorical dashboard filters:', categoricalFilters);
        
        categoricalFilters = filterList;

        return categoricalFilters;
      } catch (e) {
        console.error(e.toString());
      };
    } else {
      return filterList;
    }
  };

  return useQuery({
    queryKey: ['viz', 'filters', active],
    queryFn: () => syncFilters(active),
  });
}
