import { useState, useEffect } from 'react'
import Viz from './viz/viz'

// higher-order component composing multiple components into a single <Tableau/> component
function Tableau(props) {
  // viz object created here shared with child viz and parents via setVizLift()
  const [vizObj, setVizObj] = useState(undefined); // "viz object" providing access to Tableau API methods
  const [interactive, setInteractive] = useState(false); // viz interactivity state
  const hideTabs = props.hideTabs === 'true' ? true : false; // converts to boolean saving default to false

  // lifts state to parent components
  useEffect(() => {
    if (props.setVizLift) {
      props.setVizLift(vizObj);
    }
  },[vizObj]);

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
