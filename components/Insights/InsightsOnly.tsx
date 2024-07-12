import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { ExtensionDataContext } from '../ExtensionDataProvider';

import { useMetrics } from '../../hooks';
import { Metric } from '..';
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
} from '../../components/ui';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui';
import { IconSparkles } from '@tabler/icons-react';
import { Badge } from '../ui';

export const InsightsOnly = (props) => {
  const [user, setUser] = useState<null | string | undefined>(null);
  const [metric, setMetric] = useState<MetricProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { status: session_status, data: session_data } = useSession();

  // syncs with user metrics, only fires query when user is defined -> controlled query
  const { status, data, error, isError, isSuccess } = useMetrics(user);
  const { contextData, updateContextData } = useContext(ExtensionDataContext);
  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data?.user?.name); // value used for controlled queries
    }
    console.log(`session user name: ${session_data?.user?.name}`);
  }, [session_status, session_data]);

  useEffect(() => {
    console.log(`contextData in InsightsOnly: ${JSON.stringify(contextData, null, 2)}`)
    if (typeof contextData.currentMetric !== 'undefined' && typeof data !== 'undefined') {
      setMetric(data.find((metric) => metric.id === contextData.currentMetric));
      // if (contextData.debug) console.log(`metric: ${JSON.stringify(metric, null, 2)}`);
    }
  }, [contextData.currentMetric, data, metric, contextData]);

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

  console.log(`in insightsmodal calling MetricShell with metric: ${metric?.name}`);
  return (
    <div>
      {typeof metric !== 'undefined' && metric !== null && contextData.metricIdParamIsValid ? (
        <Dialog open={isDialogOpen} onOpenChange={(open)=>{handleOpenChange(open)}}>
          <DialogTrigger></DialogTrigger>
          <MetricShell key={metric?.id} metric={metric} />
        </Dialog>
      ) : (
        <div>
          Error: {contextData.metricIdParamIsValid ? null : 'MetricId parameter not found'}
        {metric?.id && 'metric has no id'}
        {typeof metric !== 'undefined' && 'Select a Metric in the Source Extension'}
        </div>
      )}
    </div>
  );
};

interface MetricProps {
  name: string;
  id: string;
}

interface StatsProps {
  isSuccess: boolean;
  stats: {
    value?: string;
    absolute?: string;
    relative?: string;
    direction?: string;
    color?: string;
    badge?: string;
  };
  bundleCount: number | null;
  metric: {
    name: string;
    id: string;
  };
}

export const MetricShell = (props) => {
  const { metric } = props;
  const [bundleCount, setBundleCount] = useState<number | null>(null);
  let result;
  let facts;
  let stats: any = { sentiment: undefined };
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);
  useEffect(() => {
    if (isSuccess) {
      const details = parseInsights(data);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);
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
/* 
const StatsShell: React.FC<StatsProps> = (props) => {
  const { isSuccess, stats, bundleCount, metric } = props;
  // const { contextData, updateContextData } = useContext(ExtensionDataContext);

  return (
    <div>
      <Dialog>
        <DialogTrigger 
          onClick={() => {
            console.log(`calling handleSetVal with ${metric.id}`);
          }}
        >
          <Badge
            className={`${stats.badge} text-stone-50 max-h-6 my-auto ml-6`}
            variant="undefined"
          >
            <IconSparkles width={15} height={15} className="mr-1" />
            Insights: {bundleCount}
          </Badge>
        </DialogTrigger>
        <InsightsModal metric={metric} stats={stats} />
      </Dialog>
    </div>
  );
};
 */
