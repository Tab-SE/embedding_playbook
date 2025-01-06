"use client"
import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ExtensionDataContext } from '../Providers/ExtensionDataProvider';

import { useMetricsExtensionSingle } from '../../hooks';
import { InsightsModal } from '..';
import { useInsights } from '../../hooks';
import { parseInsights } from '../../utils';
import {
  Dialog, DialogTrigger
} from '../../components/ui';
import { IconTrendingUp, IconTrendingDown, IconArrowNarrowRight } from '@tabler/icons-react';
import { parseStats } from 'utils/parse';


export const InsightsOnly = (props) => {

  const [metric, setMetric] = useState<Metric | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const { data, error } = useMetricsExtensionSingle(contextData.loginData.userName, contextData.loginData, contextData.currentMetric);

  useEffect(() => {
    if (typeof contextData.currentMetric !== 'undefined' && typeof data !== 'undefined') {
      setMetric(data[0]);
      setIsDialogOpen(true);
    }
    else if (typeof contextData.currentMetric === 'undefined' || contextData.currentMetric === '') {
      setMetric(null);
    }
  }, [data, contextData]);

  useEffect(() => {
    if (metric) {
      setIsDialogOpen(true);
    }
  }, [metric]);

  const handleOpenChange = (open:boolean) => {
    if (!open){
      contextData.handleSetVal('');
      setIsDialogOpen(open);
    }
  };

  return (
    <div>
      {typeof metric !== 'undefined' && metric !== null && contextData.metricIdParamIsValid ? (
        <Dialog open={isDialogOpen} onOpenChange={(open)=>{handleOpenChange(open)}}>
          <DialogTrigger></DialogTrigger>
          <MetricShell key={metric?.specification_id} metric={metric} />
        </Dialog>
      ) : (
        <div>
          {contextData.metricIdParamIsValid ? null : 'Error: MetricId parameter not found. If the parameter exists, reload this component (desktop) or the page (browser).'}
        {typeof metric !== 'undefined' && contextData.metricIdParamIsValid !== null && 'Select a Metric in the Source Extension'}
        </div>
      )}
    </div>
  );
};

export const MetricShell = (props) => {
  const { metric } = props;
  const [bundleCount, setBundleCount] = useState<number | null>(null);
  let stats: any = { sentiment: undefined };
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);
  useEffect(() => {
    if (isSuccess) {
      const details = parseInsights(data);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);
  if (isSuccess) {
    stats = parseStats(data, metric);
    if (stats.dir === 'up') {
      stats.direction = <IconTrendingUp />;
    } else if (stats.dir === 'down') {
      stats.direction = <IconTrendingDown />;
    } else if (stats.dir === 'flat') {
      stats.direction = <IconArrowNarrowRight />;
    }

    if (stats.comparisons && stats.comparisons[0]) {
      if (stats.comparisons[0].direction === 'up') {
        stats.comparisons[0].directionIcon = <IconTrendingUp />;
      } else if (stats.comparisons[0].direction === 'down') {
        stats.comparisons[0].directionIcon = <IconTrendingDown />;
      } else if (stats.comparisons[0].direction === 'flat') {
        stats.comparisons[0].directionIcon = <IconArrowNarrowRight />;
      }
    }

    if (stats.comparisons && stats.comparisons[1]) {
      if (stats.comparisons[1].direction === 'up') {
        stats.comparisons[1].directionIcon = <IconTrendingUp />;
      } else if (stats.comparisons[1].direction === 'down') {
        stats.comparisons[1].directionIcon = <IconTrendingDown />;
      } else if (stats.comparisons[1].direction === 'flat') {
        stats.comparisons[1].directionIcon = <IconArrowNarrowRight />;
      }
    }
  }
  return (
    isSuccess && (
      <div>
      <InsightsModal metric={metric} stats={stats} />
      </div>
    )
  );
};
