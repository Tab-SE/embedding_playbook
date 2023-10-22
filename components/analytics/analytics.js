import { useState } from 'react'
import Tableau from '../tableau/tableau'
import Toolbar from '../toolbar/toolbar'

function Analytics(props) {
  // lifts vizObj and shares it with other UI components
  const [viz, setViz] = useState(undefined);

  return (
    <section className='bg-sf-neutral-80 dark:bg-sf-white rounded'> 
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
