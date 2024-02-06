import { useState, useRef } from 'react';
import { TableauViz } from './TableauViz';
import { Metrics } from './Metrics';
import Toolbar from './Toolbar';
import { useTableauSession } from '../hooks';

export const Analytics = (props) => {
  const { src, token, height, width, hideTabs, device } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);
  
  const authenticated = useTableauSession();

  return (
    <section className='bg-colorblind-lgray rounded'> 
      <Toolbar viz={ref.current} interactive={interactive} />
      <div className='min-h-[63rem] my-2'>
        <div className='block h-40 items-center justify-center'>
          <Metrics /> 
        </div>
        <TableauViz
          ref={ref}
          src={src}
          token={token}
          height={height}
          width={width}
          hideTabs={hideTabs}
          device={device}
        />
      </div>
    </section>
  )
}
