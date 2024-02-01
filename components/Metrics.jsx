import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMetrics } from '../hooks';
import Metric from "./Metric";


function Metrics(props) {
  const [user, setUser] = useState(undefined);
  const { status: session_status, data: session_data } = useSession({});

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name); // value used for controlled queries
    }
  }, [session_status, session_data]);

  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetrics(user);

  if (isError) {
    console.debug(error);
  }

  // each status condition results in different UI representations
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center">
        <span className="btn btn-circle btn-xs mr-2 hidden sm:flex">❮</span>
        <div className="stats stats-vertical max-w-[746px] sm:stats-horizontal shadow my-3">
          {Array.isArray(data) ? data.map((metric) => (
            <Metric 
              key={metric.id} 
              metric={metric} 
            />
          )) : <></>}
        </div>
        <span className="btn btn-circle btn-xs ml-2 hidden sm:flex">❯</span>
      </div>
    );
  }
}

export default Metrics;
