import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMetrics } from '../hooks';
import Metric from "./Metric";


function Metrics(props) {
  const [user, setUser] = useState(undefined);
  const [metrics, setMetrics] = useState(undefined);
  const [metricStatus, setMetricStatus] = useState('loading');
  const { status: session_status, data: session_data } = useSession({
  });

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name);
    }
  }, [session_status, session_data]);

  // syncs with user metrics
   const metricsQuery = useMetrics(user).then((result) => {
    const { status, data, error, isError, isSuccess } = result;
    if (isError) {
      setMetricStatus(status);
      console.debug(error);
    }
    if (isSuccess) {
      setMetricStatus(status);
      setMetrics(data);
    }
   });

   // each status condition results in different UI representations
   if (metricStatus === 'success') {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(metrics) ? metrics.map((metric, index) => (
            <div key={index} className="p-4 flex items-center justify-center">
            <Metric 
              key={index} 
              metric={metric} 
              metricStatus={metricStatus} 
            />
            </div>
          )) : <></>}
        </div>
      </div>
    );
   }
}

export default Metrics;
