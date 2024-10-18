import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

import { Metrics } from 'components';
import { MainNav, MobilePreview } from './index';
import { Themes } from '../Themes';

export const HeroDemo = (props) => {
  const { hideMetrics, hideSheets } = props;
  const [theme, setTheme] = useState(null);
  const [user, setUser] = useState(null);
  const { status: session_status, data: session_data } = useSession({});

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name); // value used for controlled queries
    }
  }, [session_status, session_data]);

  // if (isError) {
  //   console.debug(error);
  // }

  return (
    <div>
      <MobilePreview />
      <div className="hidden sm:grid grid-col  my-6">
        <div className="overflow-hidden rounded-[0.5rem] border h-min-screen">
          <MainNav setTheme={setTheme} />
          <div className='pt-6 min-h-[1170px]' style={{backgroundColor: "white"}}>
            <div className='px-6 '>
              {hideMetrics ? null : <Metrics basis="sm:basis-1/2 xl:basis-1/3" />}
            </div>
            <div className="p-6">
              {hideSheets ? null : <Themes theme={theme} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
