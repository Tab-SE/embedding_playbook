import { useState, useEffect } from 'react'
import Viz from './viz/viz'

// higher-order component composing multiple components into a single <Tableau/> component
function Tableau(props) {
  // viz object created here shared with child viz and parents via setVizLift()
  const [vizObj, setVizObj] = useState(undefined); // "viz object" providing access to Tableau API methods
  const [interactive, setInteractive] = useState(false); // viz interactivity state
  const hideTabs = props.hideTabs === 'true' ? true : false; // converts to boolean saving default to false

  // parent component must provide function handlers for props in this hook:
  useEffect(() => {
    if (props.setVizLift) {
      props.setVizLift(vizObj); // lifts the viz object to parent nodes
      props.setInteractiveLift(interactive); // lifts interactive state to parent nodes
    }
  },[vizObj, interactive]);

  return (
    <Viz
      vizObj={vizObj}
      setVizObj={setVizObj}
      interactive={interactive}
      setInteractive={setInteractive}
      vizUrl={props.vizUrl}
      height={props.height}
      width={props.width}
      hideTabs={hideTabs}
      device={props.device}
      toolbar={props.toolbar}
    />
  );
}

export default Tableau;
