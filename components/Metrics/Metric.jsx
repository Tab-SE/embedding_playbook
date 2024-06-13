import { useState, useEffect } from "react";
import { IconSparkles } from '@tabler/icons-react';

import { Card, CardContent, CardHeader, CardTitle } from "components/ui";
import { Skeleton } from "components/ui";
import { Badge } from "components/ui";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "components/ui";

import { useInsights } from "hooks";
import { parseInsights } from "utils";
import { InsightsModal } from "components";


export const Metric = (props) => {
  const { metric } = props;
  // distinct count of insights
  const [bundleCount, setBundleCount] = useState(null);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { data, error, isError, isSuccess, failureCount, failureReason } = useInsights(metric);

  useEffect(() => {
    if (isSuccess) {
      // main data found in insight groups
      const details = parseInsights(data);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);

  if (isError) {
    console.debug(error);
  }

  // console.log(`failureCount ${metric.name}`, failureCount);
  // console.log(`failureReason ${metric.name}`, failureReason);


  if (isSuccess) {
    const insight_groups = data?.bundle_response?.result.insight_groups;
    if (Array.isArray(insight_groups)) {
      insight_groups.forEach((insight) => {
        // uses the ban insight to generate stats
        if (insight.type === 'ban') {
          // BAN responses only have 1 insight_groups and 1 insights
          result = data?.bundle_response?.result.insight_groups[0].insights[0].result;
          facts = result?.facts;
          // formatted current value
          stats.value = facts?.target_period_value.formatted;
          // absolute difference in unit of measurement
          stats.absolute = facts?.difference.absolute.formatted;
          // always a percentage
          stats.relative = facts?.difference.relative.formatted;
          // show a plus sign for increments
          if (stats.absolute) {
            if (!stats?.absolute.startsWith('-')) {
              stats.absolute = '+' + stats.absolute;
              stats.relative = '+' + stats.relative;
            }
          }

          // direction of the arrow icon -- new Logical/sentimental version dschober
          const dir = facts?.difference.direction;
          const sent = facts?.sentiment;

          if (dir === 'up') {
            stats.direction = '↗︎';
          } else if (dir === 'down') {
            stats.direction = '↘︎';
          } else if (dir === 'flat') {
            stats.direction = '→';
          }

          if (sent === 'positive') {
            stats.color = 'text-emerald-500';
            stats.badge = 'bg-emerald-500 dark:bg-emerald-500';
          } else if (sent === 'negative') {
            stats.color = 'text-[#e14462]';
            stats.badge = 'bg-[#e14462] dark:bg-[#e14462]';
          } else if (sent === 'neutral') {
            stats.color = 'text-[#35363B]/75';
            stats.badge = 'bg-[#35363B]/75 dark:bg-[#35363B]/75';
          }
        }
      });
    }
  }

  // fully loaded state
  return (
    <Card className="min-h-[111px] max-w-[240px] dark:bg-stone-900">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
        <CardTitle className="text-stone-500 dark:text-stone-300 leading-5 font-bold pl-3 whitespace-nowrap overflow-hidden">
          {metric.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Stats
          isSuccess={isSuccess}
          stats={stats}
          bundleCount={bundleCount}
          metric={metric}
        />
      </CardContent>
    </Card>
  )
}

const Stats = (props) => {
  const { isSuccess, stats, bundleCount, metric } = props;

  if (isSuccess) {
    return (
      <div className="grid grid-rows-2">
        <div className="grid grid-cols-12 gap-1">
          <div className="col-span-7 text-2xl font-bold text-right mr-1">
            <div className="">
              <span className={`text-2xl font-extrabold text-muted-foreground ${stats.color} pr-1`}>
                {stats.direction}
              </span>
              <span className="">{stats.value ? stats.value : null}</span>
            </div>
          </div>
          <div className="col-span-5">
            <p className={`text-xs text-muted-foreground ${stats.color}`}>
              {stats.absolute}
            </p>
            <p className={`text-xs text-muted-foreground ${stats.color}`}>
              {stats.relative ? `${stats.relative}` : null} △
            </p>
          </div>
        </div>
        <div className="flex flex-row">
          <Dialog>
            <DialogTrigger>
              <Badge className={`${stats.badge} text-stone-50 max-h-6 my-auto ml-6`}>
                <IconSparkles width={15} height={15} className="mr-1"/>
                Insights: {bundleCount}
              </Badge>
            </DialogTrigger>
            <InsightsModal metric={metric} stats={stats} />
          </Dialog>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </>
  )
}

