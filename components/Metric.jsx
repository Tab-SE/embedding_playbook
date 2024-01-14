import { useState } from "react";
import { useBan } from "../hooks";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric } = props;
  const [modal, setModal] = useState(undefined);
  let result; // contains question, markup and facts
  let facts; // contains values, changes
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
    <div className="cursor-pointer w-40" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat h-32">
        <div className="stat-title text-sm font-bold flex items-end align-bottom whitespace-normal h-10">{metric.name}</div>
        <div className="stat-value text-3xl whitespace-normal">{stats.value ? stats.value : '0'}</div>
        <div className="stat-desc whitespace-normal">{stats.direction} {stats.absolute} {stats.relative ? `(${stats.relative})` : null}</div>
      </div>
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
