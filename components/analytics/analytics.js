import { useState } from 'react'
import Tableau from '../tableau/tableau'
import Toolbar from '../toolbar/toolbar'

function Analytics(props) {
  // lifts vizObj and shares it with other UI components
  const [viz, setViz] = useState(undefined);
  const [interactive, setInteractive] = useState(false);

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={viz} interactive={interactive} />
      <div className='grid place-items-center'>
        <Tableau
          setVizLift={setViz}
          setInteractiveLift={setInteractive}
          vizUrl={props.vizUrl}
          height={props.height}
          width={props.width}
          hideTabs={props.hideTabs}
          device={props.device}
        />
      </div>
    </section>
  )
}

export default Analytics;
