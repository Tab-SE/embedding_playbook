import { useState, useRef } from 'react';
import { TableauViz } from './TableauViz';
import { Metrics } from './Metrics';
import Toolbar from './Toolbar';

export const Analytics = (props) => {
  const { src, height, width, hideTabs, device } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);

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
          height={height}
          width={width}
          hideTabs={hideTabs}
          device={device}
        />
      </div>
    </section>
  )
}
