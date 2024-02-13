import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui";

import { useMetrics } from '../../hooks';
import { Metric } from "./Metric";


export const Metrics = (props) => {
  const [user, setUser] = useState(undefined);
  const { status: session_status, data: session_data } = useSession({});
  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetrics(user);

  // updates user for authenticated components
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name); // value used for controlled queries
    }
  }, [session_status, session_data]);

  if (isError) {
    console.debug(error);
  }

  // metrics returned successfully 
  if (isSuccess) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.isArray(data) ? data.map((metric) => (
        <Metric 
          key={metric.id} 
          metric={metric} 
        />
      )) : null}
    </div>
    );
  }

  // loading state
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

    </div>
  )
}
