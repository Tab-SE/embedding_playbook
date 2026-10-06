"use client";
import { useState, useEffect } from "react";
import { IconSparkles, IconTrendingUp, IconTrendingDown, IconArrowNarrowRight } from '@tabler/icons-react';

import { Card, CardContent } from "components/ui";
import { Skeleton } from "components/ui";
import { Badge } from "components/ui";
import { Dialog, DialogTrigger } from "components/ui";

import { useInsights } from "hooks";
import { parseInsights } from "utils";
import { InsightsModal } from "components";


export const Metric = (props) => {
  const { metric } = props;
  // distinct count of insights
  const [bundleCount, setBundleCount] = useState(null);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats = { sentiment: undefined, plural: true }; // prop storing key facts
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
    console.debug('Metric Error:', error);
  }

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
          // control for plural or singular values
          if (stats.value === 1) {
            stats.plural = false;
          }
          if (stats.plural === true) {
            stats.units = metric.representation_options.number_units.plural_noun;
          }
          else if (stats.plural === false) {
            stats.units = metric.representation_options.number_units.singular_noun;
          }
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
            stats.direction = <IconTrendingUp/>;
          } else if (dir === 'down') {
            stats.direction = <IconTrendingDown/>;
          } else if (dir === 'flat') {
            stats.direction = <IconArrowNarrowRight/>;
          }

          if (sent === 'positive') {
            stats.color = 'text-metricsPositive';
            stats.badge = 'bg-metricsPositive';
          } else if (sent === 'neutral') {
            stats.color = 'text-metricsNeutral';
            stats.badge = 'bg-metricsNeutral';
          } else if (sent === 'negative') {
            stats.color = 'text-metricsNegative';
            stats.badge = 'bg-metricsNegative';
          }
        }
      });
    }
  }

  // fully loaded state
  return (
    <Card className="min-h-[120px] max-w-[240px] dark:bg-stone-900 cursor-grab shadow-md">
      <CardContent className="p-3 pt-1">
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
  const displayName = metric?.name?.includes(' - ')
    ? metric.name.split(' - ').slice(1).join(' - ')
    : metric?.name;

  if (isSuccess) {
    return (
      <div className="p-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300 line-clamp-1">
          {displayName}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-stone-900 dark:text-stone-50 leading-none">
            {stats.value}
          </span>
          <span className="text-xs text-stone-400 dark:text-stone-500">{stats.units}</span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${stats.color}`}>
          {stats.direction}
          <span>{stats.absolute}</span>
          <span>{stats.relative ? `${stats.relative} △` : null}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Badge className={`${stats.badge} text-stone-50 h-6 w-fit flex items-center justify-center cursor-pointer px-3`}>
              <IconSparkles width={13} height={13} className="mr-1"/>
              {bundleCount}
            </Badge>
          </DialogTrigger>
          <InsightsModal metric={metric} stats={stats} />
        </Dialog>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-8 grid grid-rows-3">
        <div className="text-stone-500 dark:text-stone-300 leading-5 font-bold pl-3 whitespace-nowrap overflow-hidden p-3 pb-0">
          <Skeleton className="h-5 w-28" />
        </div>
        <div className="flex items-center justify-end col-span-7 text-2xl font-bold text-right mr-1">
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-5 w-24 my-auto ml-6" />
      </div>
      <div className={`col-span-4 grid justify-evenly items-end text-xs text-muted-foreground py-2`}>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
        <div><Skeleton className="h-4 w-7" /></div>
      </div>
    </div>
  )
}
