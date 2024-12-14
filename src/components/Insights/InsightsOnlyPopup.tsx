"use client"
/*

This SHOULD be rationalized with the InsightsOnly, but there was some issue with setting currentMetric
from the PulseExtensionInsightsPopup.tsx file.  This is a work in progress.
*/


import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useMetric, useMetricPopup } from '../../hooks';
import { InsightsModal } from '..';
import { useInsights } from '../../hooks';
import {
  Dialog, DialogTrigger
} from '../ui';
import { IconTrendingUp, IconTrendingDown, IconArrowNarrowRight } from '@tabler/icons-react';
import { parseStats } from 'utils/parse';


export const InsightsOnlyPopup = (props) => {
  const {metricId} = props;
  const [user, setUser] = useState<null | string | undefined>(null);
  const [metric, setMetric] = useState<Metric | null>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { status: session_status, data: session_data } = useSession();
  const [specification_id, setSpecification_id] = useState<string | undefined>(undefined);
  const [currentMetric, setCurrentMetric] = useState<string>("");
  // const { contextData, updateContextData } = useContext(ExtensionDataContext);
  // syncs with user metrics, only fires query when user is defined -> controlled query
  // const { status, data, error, isError, isSuccess } = useMetric(user || "", {}, currentMetric);
  const { status, data, error, isError, isSuccess } = useMetricPopup(currentMetric);


useEffect(() => {
if (metricId !== null){
  setCurrentMetric(metricId);
}
}, [metricId]);

  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data?.user?.name); // value used for controlled queries
    }
    console.log(`session user name: ${session_data?.user?.name}`);
  }, [session_status, session_data]);

  useEffect(() => {
    // console.log(`contextData in InsightsOnly: ${JSON.stringify(contextData, null, 2)}`)
    if (typeof currentMetric !== 'undefined' && typeof data !== 'undefined') {
      setMetric(data[0]);
      // if (contextData.debug) console.log(`metric: ${JSON.stringify(metric, null, 2)}`);
    }
  }, [currentMetric, data, metric]);

  console.log(`in insightsonly calling MetricShell with metric: ${(metric as any)?.name} `);
  return (
    <div>
      {typeof metric !== 'undefined' && metric !== null && (
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
  let result;
  let facts;
  let stats: any = { sentiment: undefined };
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);

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
      {/* <StatsShell isSuccess={isSuccess} stats={stats} bundleCount={bundleCount} metric={metric} />
       */}
      <InsightsModal metric={metric} stats={stats} />
    </div>
  );
};
