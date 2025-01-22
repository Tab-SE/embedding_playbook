"use client"
// eslint-disable-next-line no-unused-vars
import { useEffect } from 'react';
import { MetricCollection } from 'models';
import { Skeleton } from '../ui';
import { useMetricsExtension } from 'hooks';
import _ from 'lodash';

export const LoadMetricsOnly = (props: any) => {
  const {loginData, metricCollection, setMetricCollection} = props;
  const { status, data, error, isError, isSuccess, signInError } = useMetricsExtension(loginData.userName, loginData);

  useEffect(() => {
    if ( data && !_.isEqual(data, metricCollection.metrics) && !isError ) {
      let m = new MetricCollection(data);
      m.setMetricOptions(metricCollection.metricOptions);
      setMetricCollection(m);
    }
  }, [data]);

  let debug = 'false';
  return (
    <div>
      {status === 'pending' && !signInError && <Skeleton className="h-6 w-1/3">Loading</Skeleton>}
      {isSuccess && (
      <div>Number of metrics loaded: {metricCollection.metrics.length}</div>
      )}
      {signInError && (
      <div className="alert alert-danger" role="alert">
        {signInError || 'There was an error signing in. Please try again later.'}
      </div>
      )}
    </div>
  );
};
