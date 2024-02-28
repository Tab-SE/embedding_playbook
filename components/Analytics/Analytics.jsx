import { useState } from 'react';

import { MainNav, MobilePreview, Sheets } from './index';
import { Metrics } from './Metrics';


export const Analytics = (props) => {
  const { hideMetrics, hideSheets } = props;
  const [theme, setTheme] = useState(null);

  return (
    <>
      <MobilePreview />
      <div className="hidden flex-col md:flex my-6">
        <div className="overflow-hidden rounded-[0.5rem] border dark:border-stone-600 bg-background shadow-xl h-min-screen">
          <MainNav setTheme={setTheme} />
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
