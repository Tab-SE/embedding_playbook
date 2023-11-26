import { useState, useRef } from 'react'
import Tableau from '../Tableau/Tableau'
import Toolbar from '../Toolbar/Toolbar'

function Analytics(props) {
  const viz = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [interactive, setInteractive] = useState(false);

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={viz.current} interactive={interactive} />
      <div className='py-2'>
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
