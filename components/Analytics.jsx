import { useState, useRef } from 'react';
import { TableauViz } from './TableauViz';
import { Metrics } from './Metrics';
import Toolbar from './Toolbar';
import { useTableauSession } from '../hooks';

export const Analytics = (props) => {
  const viz = useRef(null); // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const [interactive, setInteractive] = useState(false);
  
  const authenticated = useTableauSession();

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={viz.current} interactive={interactive} />
      <div className='min-h-[63rem] my-2'>
        <div className='block h-40 items-center justify-center'>
          <Metrics /> 
        </div>
        <TableauViz
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
