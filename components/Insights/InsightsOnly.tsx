import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ExtensionDataContext } from '../ExtensionDataProvider';

import { useMetric } from '../../hooks';
import { InsightsModal } from '..';
import { useInsights } from '../../hooks';
import { parseInsights } from '../../utils';
import {
  Dialog, DialogTrigger
} from '../../components/ui';
import { IconTrendingUp, IconTrendingDown, IconArrowNarrowRight } from '@tabler/icons-react';
import { parseStats } from 'utils/parse';


export const InsightsOnly = (props) => {

  const [user, setUser] = useState<null | string | undefined>(null);
  const [metric, setMetric] = useState<Metric | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { status: session_status, data: session_data } = useSession();
  const [specification_id, setSpecification_id] = useState<string | undefined>(undefined);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  const { data, error } = useMetric(contextData.loginData.userName, contextData.loginData, contextData.currentMetric);
  // syncs with user metrics, only fires query when user is defined -> controlled query
  //const { data } = useMetric(contextData.loginData.userName, contextData.loginData, metric.specification_id);
  // useEffect(() => {
  //   if (session_status === 'authenticated') {
  //     setUser(session_data?.user?.name); // value used for controlled queries
  //   }
  //   console.log(`session user name: ${session_data?.user?.name}`);
  // }, [session_status, session_data]);

  useEffect(() => {
    if (contextData.debug === "true") console.log(`contextData in InsightsOnly: ${JSON.stringify(contextData, null, 2)}`)
    if (typeof contextData.currentMetric !== 'undefined' && typeof data !== 'undefined') {
      setMetric(data[0]);
      // if (contextData.debug) console.log(`metric: ${JSON.stringify(metric, null, 2)}`);
    }
    else if (typeof contextData.currentMetric === 'undefined'){
      setMetric(null);
    }
  }, [data, contextData]);

  useEffect(() => {
    console.log(`insights only data...`);
    console.log(data);
  }, [data])

/*   useEffect(() => {
    if (contextData.currentMetric !== "" && contextData.currentMetric !== specification_id) {
      setSpecification_id(contextData.currentMetric);
    }
  }, [contextData.currentMetric]); */

  useEffect(() => {
    if (metric) {
      setIsDialogOpen(true);
    }
  }, [metric]);

  const handleOpenChange = (open:boolean) => {
    console.log(`calling handleOpenChange with ${open}`);
    if (!open){
      contextData.handleSetVal('');
      setIsDialogOpen(open);
    }
  };

  console.log(`in insightsonly calling MetricShell with metric: ${(metric as any)?.name} `);
  return (
    <div>
      {typeof metric !== 'undefined' && metric !== null && contextData.metricIdParamIsValid ? (
        <Dialog open={isDialogOpen} onOpenChange={(open)=>{handleOpenChange(open)}}>
          <DialogTrigger></DialogTrigger>
          <MetricShell key={metric?.specification_id} metric={metric} />
        </Dialog>
      ) : (
        <div>
          Error: {contextData.metricIdParamIsValid ? null : 'MetricId parameter not found'}
        {metric?.specification_id && 'metric has no id'}
        {typeof metric !== 'undefined' && 'Select a Metric in the Source Extension'}
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
    <div>
      <InsightsModal metric={metric} stats={stats} />
    </div>
  );
};
