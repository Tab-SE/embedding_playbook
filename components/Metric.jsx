import { useState, useEffect } from "react";
import { useInsights } from "../hooks";
import { parseInsights } from "../utils";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric } = props;
  const [modal, setModal] = useState(undefined);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useInsights(metric);

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

    return (
      <div className="cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
        <Stat metric={metric} stats={stats} />
        <Details metric={metric} stats={stats} setModal={setModal} />
      </div>
    )
  } else {
    return (
      <div className="stat h-36 w-40 px-5">
        <div className="skeleton w-full h-8"></div>
        <div className="skeleton w-full h-8"></div>
        <div className="skeleton w-9/12 h-4"></div>
        <div className="skeleton w-9/12 h-4"></div>  
      </div>
    )
  }  
}

function Stat(props) {
  const { metric, stats } = props;
  const [bundleCount, setBundleCount] = useState(0);
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useInsights(metric);

  if (isError) {
    console.debug(error);
  }

  useEffect(() => {
    if (isSuccess) {
      // main data found in insight groups
      const details = parseInsights(data);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);

  return (
    <div className="stat h-36 w-40 px-5">
      <div className="stat-title text-sm font-bold flex items-end align-bottom whitespace-normal h-10">{metric.name}</div>
      <div className="stat-value text-3xl whitespace-normal">{stats.value ? stats.value : '0'}</div>
      <div className={`stat-desc ${stats.color} whitespace-normal`}>
        &nbsp; {stats.direction} {stats.absolute} {stats.relative ? `(${stats.relative})` : null}
      </div> 
      <div className="stat-desc whitespace-normal mt-2">
        Insights: <span className={`badge badge-sm ${stats.badge} text-stone-50 ml-1`}>{bundleCount}</span>
      </div>      
    </div>
  )
}

function Details(props) {
  const { metric, stats, setModal } = props;

  return (
    <Modal setModal={setModal} >
      <Insights metric={metric} stats={stats} />
      <div className="flex justify-center gap-12 w-full">
        <kbd className="kbd kbd-lg">◀︎</kbd>
        <kbd className="kbd kbd-lg">Swipe</kbd>
        <kbd className="kbd kbd-lg">▶︎</kbd>
      </div>
    </Modal>
  );
}


