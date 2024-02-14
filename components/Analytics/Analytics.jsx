import { useState, useRef } from 'react';

import { MobilePreview } from './MobilePreview';
import { MainNav } from './MainNav';
import { Metrics } from './Metrics';
import { Sheets } from './Sheets';


export const Analytics = (props) => {
  const { src, height, width, hideTabs, device, toolbar } = props;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const [interactive, setInteractive] = useState(false);
  const [date, setDate] = useState(new Date());

  return (
    <>
      <MobilePreview />
      <div className="hidden flex-col md:flex">
        <div className="overflow-hidden rounded-[0.5rem] border dark:border-stone-600 bg-background shadow-md md:shadow-xl">
          <MainNav />
          <div className="flex-1 space-y-4 p-8 pt-6">
            <Metrics />
            <Sheets />
          </div>
        </div>
      </div>
    </>
  )
}
