import { useState, useRef } from 'react';

import { MobilePreview } from './MobilePreview';
import { MainNav } from './MainNav';
import { Metrics } from './Metrics';
import { Sheets } from './Sheets';


export const Analytics = (props) => {
  const { theme, hideMetrics, hideSheets } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <>
      <MobilePreview />
      <div className="hidden flex-col md:flex">
        <div className="overflow-hidden rounded-[0.5rem] border dark:border-stone-600 bg-background shadow-xl h-min-screen">
          <MainNav />
          <div className='bg-stone-300 dark:bg-stone-700 pt-6 h-[1170px]'>
            {hideMetrics ? null : <Metrics theme={theme} />}
            <div className="p-6">
              {hideSheets ? null : <Sheets theme={theme} />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
