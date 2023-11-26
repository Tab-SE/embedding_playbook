import { useState, useRef } from 'react'
import Tableau from '../tableau/tableau'
import Toolbar from '../toolbar/toolbar'

function Analytics(props) {
  const viz = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  // lifts vizObj and shares it with other UI components
  const [vizObj, setVizObj] = useState(null);
  const [interactive, setInteractive] = useState(false);

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={viz.current} interactive={interactive} />
      <div className='py-2'>
        <Tableau
          vizObj={vizObj}
          setVizObj={setVizObj}
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
