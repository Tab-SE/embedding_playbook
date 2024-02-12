import { useState, useRef } from 'react';

import { Button } from "../ui";

// import { CalendarDateRangePicker } from "@/app/examples/dashboard/components/date-range-picker"
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
        <MainNav />
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Superstore Analytics</h2>
            <div className="flex items-center space-x-2">
              {/* <CalendarDateRangePicker /> */}
              <Button>Download</Button>
            </div>
          </div>
          <Metrics />
          <Sheets />
        </div>
      </div>
    </>
  )
}
