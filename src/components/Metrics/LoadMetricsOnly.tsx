"use client"
// eslint-disable-next-line no-unused-vars
import { useEffect } from 'react';
import { MetricCollection } from 'models';
import { Skeleton } from '../ui';
import { useMetricsExtension } from 'hooks';
import _ from 'lodash';

export const LoadMetricsOnly = (props: any) => {
  const {loginData, metricCollection, setMetricCollection} = props;
  const { status, data, error, isError, isSuccess } = useMetricsExtension(loginData.userName, loginData);

  useEffect(() => {
    if ( data && data.length > 0 && !_.isEqual(data, metricCollection.metrics) && !isError ) {
      let m = new MetricCollection(data);
      m.setMetricOptions(metricCollection.metricOptions);
      setMetricCollection(m);
    }
  }, [data]);

  let debug = 'false';
  return (
    <div>
      {debug === 'true' && (
        <div>
          Load Metrics
          <br />
          ----------------
          <br />
        </div>
      )}
      {metricCollection.metrics && metricCollection.metrics.length ? `Number of metrics loaded: ${metricCollection.metrics.length}` : <Skeleton className="h-6 w-1/3" />}
    </div>
  );
};