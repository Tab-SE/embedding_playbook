import { useState } from 'react'
import Viz from './viz/viz'
import Toolbar from '../toolbar/toolbar'

// higher-order component composing multiple components into a single <Tableau/> component
function Tableau(props) {
  // lifting state to share it with non <Viz/> components (e.g. custom toolbar)
  const [vizObj, setVizObj] = useState(undefined); // "viz object" providing access to Tableau API methods
  const [interactive, setInteractive] = useState(false); // viz interactivity state
  const hideTabs = props.hideTabs === 'true' ? true : false;

  return (
    <section className='bg-sfneutral80 dark:bg-sfneutral95 rounded'> 
      <Toolbar/>
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
    </section>
  );
}

export default Tableau;
