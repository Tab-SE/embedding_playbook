import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";

import { Metrics } from 'components';
import { useMetadata } from 'hooks';

import { MainNav, MobilePreview, Sheets } from './index';


export const Analytics = (props) => {
  const { hideMetrics, hideSheets } = props;
  const elementRef = useRef(null);
  const [theme, setTheme] = useState(null);
  const [user, setUser] = useState(null);
  const { status: session_status, data: session_data } = useSession({});
  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetadata(user);

  useEffect(() => {
    if (elementRef.current) {
        const { width } = elementRef.current.getBoundingClientRect();
        console.log(elementRef.current);
        console.log('Width:', width);
    }
  }, []);

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name); // value used for controlled queries
    }
  }, [session_status, session_data]);

  if (isError) {
    console.debug(error);
  }

  

  return (
    <>
      <MobilePreview />
      <div className="hidden flex-col md:flex my-6" ref={elementRef}>
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
