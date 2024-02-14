import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui";
import { Skeleton } from "../ui";

import { useInsights } from "hooks";
import { parseInsights } from "utils";
// import { Modal } from "./Modal";
// import { Insights } from "./Insights";


export const Metric = (props) => {
  const { metric } = props;
  // modal displays available insights
  const [modal, setModal] = useState(undefined);
  // distinct count of insights
  const [bundleCount, setBundleCount] = useState(0);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { data, error, isError, isSuccess } = useInsights(metric);

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
          // direction of the arrow icon
          const dir = facts?.difference.direction;
          if (dir === 'up') {
            stats.direction = '↗︎';
            stats.color = 'text-sky-600';
            stats.badge = 'badge-primary';
          } else if (dir === 'down') {
            stats.direction = '↘︎';
            stats.color = 'text-orange-600';
            stats.badge = 'badge-secondary';
          } else if (dir === 'flat') {
            stats.direction = '→';
            stats.color = 'text-stone-500';
            stats.badge = 'badge-neutral';
          }
        }
      });
    }
  }

  // fully loaded state 
  return (
    <Card className="min-h-32">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-1">
        <CardTitle className="text-sm font-medium pl-4">
          {metric.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Stats isSuccess={isSuccess} stats={stats} />
      </CardContent>
    </Card>
  )
}

const Stats = (props) => {
  const { isSuccess, stats } = props;

  if (isSuccess) {
    return (
      <div className="grid grid-rows-2 border">
        <div className="grid grid-cols-12 border">
          <div className="col-span-8 text-2xl font-bold text-center">
            <div className="">
              <span className={`text-2xl font-extrabold text-muted-foreground ${stats.color} pr-1`}>
                {stats.direction}
              </span>
              <span className="">{stats.value ? stats.value : null}</span>
            </div>
          </div>
          <div className="col-span-4">
            <p className={`text-xs text-muted-foreground ${stats.color}`}>
              &nbsp; {stats.absolute}
            </p>
            <p className={`text-xs text-muted-foreground ${stats.color}`}>
              &nbsp; {stats.relative ? `(${stats.relative})` : null}
            </p>
          </div>
        </div>
        <div></div>
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

