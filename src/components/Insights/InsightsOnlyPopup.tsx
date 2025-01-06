"use client"
/*

This SHOULD be rationalized with the InsightsOnly, but there was some issue with setting currentMetric
from the PulseExtensionInsightsPopup.tsx file.  This is a work in progress.
*/


import { useState, useEffect } from 'react';
import { useMetricPopup } from '../../hooks';
import { InsightsModal } from '..';
import { useInsights } from '../../hooks';
import {
  Dialog, DialogTrigger
} from '../ui';
import { IconTrendingUp, IconTrendingDown, IconArrowNarrowRight } from '@tabler/icons-react';
import { parseStats } from 'utils/parse';


export const InsightsOnlyPopup = (props) => {
  const {metricId} = props;
  const [metric, setMetric] = useState<Metric | null>(null);
  const [currentMetric, setCurrentMetric] = useState<string>("");
  const { status, data, error, isError, isSuccess } = useMetricPopup(currentMetric);

useEffect(() => {
if (metricId !== null){
  setCurrentMetric(metricId);
}
}, [metricId]);

  useEffect(() => {
    if (typeof currentMetric !== 'undefined' && typeof data !== 'undefined' && data[0]) {
      setMetric(data[0]);
    }
  }, [currentMetric, data, metric]);

  if (process.env.DEBUG?.toLowerCase() === 'true') console.log(`in insightsonly calling MetricShell with metric: ${(metric as any)?.name} `);
  return (
    <div>
      {metric && (
        <Dialog open={true} onOpenChange={(open)=>{window.close();}}>
          <DialogTrigger></DialogTrigger>
          <MetricShell key={metric?.specification_id} metric={metric} />
        </Dialog>
      ) }
    </div>
  );
};

export const MetricShell = (props) => {
  const { metric } = props;
  let stats: any = { sentiment: undefined };
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);

  let viz;
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
    <div>
      <InsightsModal metric={metric} stats={stats} />
    </div>
  );
};
