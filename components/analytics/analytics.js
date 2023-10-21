import { useState, useEffect } from 'react'
import Tableau from '../tableau/tableau'
import Toolbar from '../toolbar/toolbar'

function Analytics(props) {
  // can lift the viz object and share it with other UI components
  const [viz, setViz] = useState(undefined);

  return (
    <section className='bg-sfneutral80 dark:bg-sfneutral95 rounded'> 
      <Toolbar viz={viz} />
      <Tableau
        setVizLift={setViz}
        vizUrl={props.vizUrl}
        height={props.height}
        width={props.width}
        hideTabs={props.hideTabs}
        device={props.device}
      />
    </section>
  )
}

export default Analytics;
