import { useState, useEffect } from 'react'
import Tableau from '../tableau/tableau'
import Toolbar from '../toolbar/toolbar'

function Analytics(props) {
  // lifts vizObj and shares it with other UI components
  const [vizObj, setVizObj] = useState(null);
  const [interactive, setInteractive] = useState(false);

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={vizObj} interactive={interactive} />
      <div className='grid place-items-center'>
        <Tableau
          vizObj={vizObj}
          setVizObj={setVizObj}
          interactive={interactive}
          setInteractive={setInteractive}
          src={props.src}
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
