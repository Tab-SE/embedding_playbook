import { useState, useId, useRef, forwardRef } from 'react'
import { useCategoricalFilter } from './components/controller'
import View from './components/view'
import Model from './components/model'

// HOC following MVC pattern: https://medium.com/swlh/elements-of-mvc-in-react-9382de427c09, forwardRef HOC receives ref from parent
const Tableau = forwardRef(function Tableau(props, ref) {
  const viz = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [vizObj, setVizObj] = useState(null);
  const [localInteractive, setLocalInteractive] = useState(false);
  const id = `tableau-viz-${useId()}`; // creates a unique identifier for the embed

  let dashboard;

  const handleDashboard = async () => {
    if (viz.current) {
      dashboard = await props.viz.workbook.activateSheetAsync('Profitability (E)');
    }
  }

  // handleDashboard();

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

export { useCategoricalFilter } ;
export default Tableau;
