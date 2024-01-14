import { useState, useRef } from 'react'
import Tableau from './Tableau'
import Metrics from './Metrics';
import Toolbar from './Toolbar'
import { useTableauSession } from '../hooks';

function Analytics(props) {
  const viz = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [interactive, setInteractive] = useState(false);
  
  const authenticated = useTableauSession();

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={viz.current} interactive={interactive} />
      <div className='min-h-[64rem] my-2'>
        <div className='block h-36 items-center justify-center'>
          <Metrics /> 
        </div>
        <Tableau
          interactive={interactive}
          setInteractive={setInteractive}
          viz={viz}
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
