import { useState, useId, useRef, forwardRef, useEffect } from 'react'
import { useFilters } from './components/controller'
import View from './components/view'
import Model from './components/model'

// HOC following MVC pattern: https://medium.com/swlh/elements-of-mvc-in-react-9382de427c09, forwardRef HOC receives ref from parent
const Tableau = forwardRef(function Tableau(props, ref) {
  const vizLocal = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const id = `id-${useId()}`; // creates a unique identifier for the embed
  const [vizObj, setVizObj] = useState(null);
  const [localInteractive, setLocalInteractive] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const viz = props.viz ? props.viz.current : vizLocal.current;
  const interactive = props.interactive ? props.interactive : localInteractive;

  useEffect(() => {
    const getDashboard = () => {
      if (viz) {
        // get the active sheet which may be a dashboard, sheet or story
        setDashboard(viz.workbook.activeSheet);
      }
    }

    if (!dashboard && interactive) {
      getDashboard();
    }
  }, [viz, dashboard, interactive]);
  
  // const { status, isFetched, isLoading, isSuccess, data, isError, error } = useFilters(dashboard, id);

  useFilters(dashboard, id).then(({ status, isFetched, isLoading, isSuccess, data, isError, error }) => {
    if (status === 'pending') {
      console.log('requesting data...');
      if (isLoading) {
        console.log('loading data...');
      }
    } else if (status === 'success') {
      console.log(status, `The number of filters is: ${data.length}`, data);
      // show # and names of categorical filters in the Console
      // categoricalFilters = dashFilters.filter((df) => df.filterType === FilterType.Categorical);
      // nonCategoricalFilters = dashFilters.filter((df) => df.filterType !== FilterType.Categorical);
      // console.log(`Filters: ${filter.map((s) => s.fieldName)}`);
      // console.log('Available categorical dashboard filters:', filter);
    }
  }, (e) => {

  });

  
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
