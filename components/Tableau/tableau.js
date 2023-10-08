import { useState } from 'react'
import Viz from './viz/viz'

// higher-order component composing multiple components into a single <Tableau/> component
function Tableau(props) {
  // lifting state to share it with non <Viz/> components (e.g. custom toolbar)
  const [vizObj, setVizObj] = useState(undefined); // "viz object" providing access to Tableau API methods
  const [interactive, setInteractive] = useState(false); // viz interactivity state
  let hideTabs = props.hideTabs === 'true' ? true : false;

  return (
    <> 
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
    </>
  );
}

export default Tableau;
