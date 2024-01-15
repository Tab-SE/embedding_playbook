import { useState, useEffect } from "react";
import { useBan, useDetail } from "../hooks";
import { parseDetail } from "../utils";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric } = props;
  const [modal, setModal] = useState(undefined);
  let result; // contains question, markup and facts
  let facts; // contains values, absolute and relative changes
  let stats = { sentiment: undefined }; // prop storing key facts
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useBan(metric);

  if (isError) {
    console.debug(error);
  }

  if (isSuccess) {
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
    } else if (dir === 'down') {
      stats.direction = '↘︎';
    } else if (dir === 'flat') {
      stats.direction = '→';
    }
  }

  return (
    <div className="cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
      <Stat metric={metric} stats={stats} />
      <Modal setModal={setModal} >
        <Insights metric={metric} stats={stats} />
        <div className="flex justify-center gap-12 w-full">
          <kbd className="kbd kbd-lg">◀︎</kbd>
          <kbd className="kbd kbd-lg">Swipe</kbd>
          <kbd className="kbd kbd-lg">▶︎</kbd>
        </div>
      </Modal>
    </div>
  )
}

function Stat(props) {
  const { metric, stats } = props;
  const [bundleCount, setBundleCount] = useState(0);
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useDetail(metric);

  if (isError) {
    console.debug(error);
  }

  useEffect(() => {
    if (isSuccess) {
      // main data found in insight groups
      const details = parseDetail(data);
      setBundleCount(details.length);
    }
  }, [isSuccess, data]);

  return (
    <div className="stat h-36 w-40">
      <div className="stat-title text-sm font-bold flex items-end align-bottom whitespace-normal h-10">{metric.name}</div>
      <div className="stat-value text-3xl whitespace-normal">{stats.value ? stats.value : '0'}</div>
      <div className="stat-desc whitespace-normal">
        &nbsp; {stats.direction} {stats.absolute} {stats.relative ? `(${stats.relative})` : null}
      </div> 
      <div className="stat-desc whitespace-normal mt-2">
        Insights: <span className="badge badge-sm badge-primary ml-1">{bundleCount}</span>
      </div>      
    </div>
  )
}
