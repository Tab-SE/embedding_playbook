import { useState, useEffect } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui";

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

    // fully loaded state 
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {metric.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.value ? stats.value : null}</div>
          <p className={`text-xs text-muted-foreground ${stats.color}`}>
            &nbsp; {stats.direction} {stats.absolute} {stats.relative ? `(${stats.relative})` : null}
          </p>
        </CardContent>
      </Card>
    )
  } else {
    // if in a loading state, display the metric name and a skeleton
    return (
      <div className="stat h-36 w-40 pl-4 pr-3 pt-3 pb-5">
        <div className="stat-title text-sm font-bold flex items-end align-bottom whitespace-normal h-10">{metric.name}</div>
        <div className="skeleton w-full h-8"></div>
        <div className="skeleton w-9/12 h-4"></div>
        <div className="skeleton w-9/12 h-4"></div>     
      </div>
    )
  }

  
}
