/*

This SHOULD be rationalized with the InsightsOnly, but there was some issue with setting currentMetric
from the PulseExtensionInsightsPopup.tsx file.  This is a work in progress.
*/


import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ExtensionDataContext } from '../ExtensionDataProvider';

import { useMetric } from '../../hooks';
import { InsightsModal } from '..';
import { useInsights } from '../../hooks';
import { parseInsights } from '../../utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui';


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
  const { status, data, error, isError, isSuccess } = useMetric(user, currentMetric);


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
    const insight_groups = data?.bundle_response?.result.insight_groups;
    if (Array.isArray(insight_groups)) {
      insight_groups.forEach((insight) => {
        if (insight.type === 'ban') {
          result = data?.bundle_response?.result.insight_groups[0].insights[0].result;
          facts = result?.facts;
          stats.value = facts?.target_period_value.formatted;
          stats.absolute = facts?.difference.absolute.formatted;
          stats.relative = facts?.difference.relative.formatted;
          if (stats.absolute) {
            if (!stats?.absolute.startsWith('-')) {
              stats.absolute = '+' + stats.absolute;
              stats.relative = '+' + stats.relative;
            }
          }
          const dir = facts?.difference.direction;
          const sent = facts?.sentiment;
          if (dir === 'up') {
            stats.direction = '↗︎';
            if (sent === 'positive') {
              stats.color = 'text-sky-600';
              stats.badge = 'bg-sky-600 dark:bg-sky-600';
            } else if (sent === 'negative') {
              stats.color = 'text-orange-600';
              stats.badge = 'bg-orange-600 dark:bg-orange-600';
            } else if (sent === 'neutral') {
              stats.color = 'text-stone-500 dark:text-stone-400';
              stats.badge = 'bg-stone-500 dark:bg-stone-400';
            }
          } else if (dir === 'down') {
            stats.direction = '↘︎';
            if (sent === 'positive') {
              stats.color = 'text-sky-600';
              stats.badge = 'bg-sky-600 dark:bg-sky-600';
            } else if (sent === 'negative') {
              stats.color = 'text-orange-600';
              stats.badge = 'bg-orange-600 dark:bg-orange-600';
            } else if (sent === 'neutral') {
              stats.color = 'text-stone-500 dark:text-stone-400';
              stats.badge = 'bg-stone-500 dark:bg-stone-400';
            }
          } else if (dir === 'flat') {
            stats.direction = '→';
            if (sent === 'positive') {
              stats.color = 'text-sky-600';
              stats.badge = 'bg-sky-600 dark:bg-sky-600';
            } else if (sent === 'negative') {
              stats.color = 'text-orange-600';
              stats.badge = 'bg-orange-600 dark:bg-orange-600';
            } else if (sent === 'neutral') {
              stats.color = 'text-stone-500 dark:text-stone-400';
              stats.badge = 'bg-stone-500 dark:bg-stone-400';
            }
          }
        }
      });
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
