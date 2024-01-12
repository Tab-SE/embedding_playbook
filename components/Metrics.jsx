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
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(data) ? data.map((metric, index) => (
            <div key={index} className="p-4 flex items-center justify-center">
              <Metric 
                key={index} 
                metric={metric} 
              />
            </div>
          )) : <></>}
        </div>
      </div>
    );
  }

}

export default Metrics;
