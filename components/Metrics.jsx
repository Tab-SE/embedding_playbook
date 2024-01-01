import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMetrics, useInsights } from '../hooks';
import Metric from "./Metric";


function Metrics(props) {
  const [user, setUser] = useState(undefined);
  const [metrics, setMetrics] = useState(undefined);
  const [status, setStatus] = useState('loading');
  const { status: session_status, data: session_data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // => This component should wrap all other Tableau components: https://next-auth.js.org/getting-started/client#require-session
    },
  });

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name);
    }
  }, [session_status, session_data]);

  // tanstack query hooks, indexed by user
   const metricsQuery = useMetrics(user).then((result) => {
    const { status, data, error, isError, isSuccess } = result;
    if (isError) {
      setStatus(status);
      console.debug(error);
    }
    if (isSuccess) {
      setStatus(status);
      setMetrics(data);
    }
   });

   // each status condition results in different UI representations
   if (status === 'success') {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="p-4 flex items-center justify-center">
              <Metric key={index} metric={metric} status={status} />
            </div>
          ))}
        </div>
      </div>
    );
   }
}

export default Metrics;
