'use client';
/*
This is the carousel metrics page from embed tableau.  It fetches the SUBSCRIBED metrics for the user.
*/

import { useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';

import { MetricsPlusFilters } from './MetricsPlusFilters';
import { ExtensionDataContext } from '../Providers';
import { MetricCollection } from 'models';
import { sortPayloadByIds } from '.';
import { useMetricsExtension } from 'hooks/useMetricsExtension';
import { FontSelector, LoadDatasources } from '..';

export const Metrics = (props) => {
  const { theme, showMetrics, showInsights, metricOptions, sortOrder } = props;
  // const [user, setUser] = useState<null | string>(null);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const { status: session_status, data: session_data } = useSession();
  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess, signInError } = useMetricsExtension(
    contextData.loginData.userName,
    contextData.loginData
  );

  useEffect(() => {
    if (data && data.length > 0 && !isError && !signInError) {
      // extract metrics if data is available
      let metrics = sortPayloadByIds(data, sortOrder);
      let metricCollection = new MetricCollection(metrics);
      metricCollection.setMetricOptions(contextData.metricCollection.metricOptions);
      updateContextData({ metricCollection: metricCollection });
    }
  }, [data]);

  if (isError) {
    console.debug(error);
  }

  return (
    <>
      {isError && (
        <div className="alert alert-danger" role="alert">
          {error.message || 'There was an error fetching the metrics. Please try again later.'}
        </div>
      )}
      {signInError && (
        <div className="alert alert-danger" role="alert">
          {signInError || 'There was an error signing in. Please try again later.'}
        </div>
      )}
      {data && contextData.options.googleFont?.fontFamily && contextData.options.googleFont?.fontWeight && (
        <FontSelector
          fontName={contextData.options.googleFont.fontFamily}
          weight={contextData.options.googleFont.fontWeight}
        />
      )}
      <LoadDatasources />
      {!isError && !signInError && <MetricsPlusFilters />}
    </>
  );
};
