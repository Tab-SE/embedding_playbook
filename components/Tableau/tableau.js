import { useState, useId, useRef, forwardRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFilters } from './components/controller'
import View from './components/view'
import Model from './components/model'

// HOC following MVC pattern: https://medium.com/swlh/elements-of-mvc-in-react-9382de427c09, forwardRef HOC receives ref from parent
const Tableau = forwardRef(function Tableau(props, ref) {
  const vizLocal = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [vizObj, setVizObj] = useState(null);
  const [localInteractive, setLocalInteractive] = useState(false);
  const id = `id-${useId()}`; // creates a unique identifier for the embed
  const viz = props.viz ? props.viz.current : vizLocal.current;
  const interactive = props.interactive ? props.interactive : localInteractive;

  const [dashboard, setDashboard] = useState(null);

  const active = !dashboard ? false : true;

  let filters = [];

  async function syncFilters() {
    // For more information, see https://help.tableau.com/current/api/embedding_api/en-us/docs/embedding_api_filter.html
    if (!dashboard) {
      filters = [];
    } else {
      try {
        return filters = await dashboard.getFiltersAsync();

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

  // const result = useFilters(dashboard, id);

  const result = useQuery({
    queryKey: ['tableau', 'viz', 'filters', id],
    queryFn: () => syncFilters(),
    enabled: active,
    placeholderData: [],
    initialData: []
  });

  if (result.isLoading) {
    console.log('loading data:', result.data);
  }
  if (result.isError) {
    console.error('data error:', result.error);
  }
  if (result.isSuccess) {
    console.log('success data:', result.data);
  }

  // console.log('result:', result);



  useEffect(() => {
    function getDashboard() {
      if (viz) {
        // get the active sheet which may be a dashboard, sheet or story
        setDashboard(viz.workbook.activeSheet);
      }
    }

    if (!dashboard && interactive) {
      getDashboard();
    }
  }, [viz, interactive, dashboard]);

  return (
    <View
      vizObj={props.vizObj ? props.vizObj : vizObj}
      setVizObj={props.setVizObj ? props.setVizObj : setVizObj}
      interactive={props.interactive ? props.interactive : localInteractive}
      setInteractive={props.setInteractive ? props.setInteractive : setLocalInteractive}
      ref={props.viz ? props.viz : viz}
      id={id}
      src={props.src}
      height={props.height}
      width={props.width}
      device={props.device}
      hideTabs={props.hideTabs}
      toolbar={props.toolbar}
    />
  );
});

export { useFilters } ;
export default Tableau;
