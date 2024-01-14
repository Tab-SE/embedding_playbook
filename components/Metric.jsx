import { useState } from "react";
import { useBan } from "../hooks";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric } = props;
  const [modal, setModal] = useState(undefined);
  let result; // contains question, markup and facts
  let facts; // contains values, changes
  let sentiment;
  let direction;
  let absolute;
  let relative;
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useBan(metric);

  if (isError) {
    console.debug(error);
  }

  if (isSuccess) {
    // BAN responses only have 1 insight_groups and 1 insights
    result = data?.bundle_response?.result.insight_groups[0].insights[0].result; 
    facts = result?.facts;
    // absolute difference in unit of measurement
    absolute = facts?.difference.absolute.formatted;
    // always a percentage
    relative = facts?.difference.relative.formatted;
    // direction of the arrow icon
    direction = facts?.difference.direction;
    if (direction === 'up') {
      direction = '↗︎';
    } else if (direction === 'down') {
      direction = '↘︎';
    } else if (direction === 'flat') {
      direction = '→';
    }
    console.log(`${metric.name} sentiment`, sentiment);
  }

  return (
    <div className="cursor-pointer w-40" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat h-32">
        <div className="stat-title text-sm font-bold flex items-end align-bottom whitespace-normal h-10">{metric.name}</div>
        <div className="stat-value text-3xl whitespace-normal">{facts ? facts.target_period_value.formatted : '0'}</div>
        <div className="stat-desc whitespace-normal">{direction} {absolute} {relative ? `(${relative})` : null}</div>
      </div>
      <Modal setModal={setModal} >
        <Insights metric={metric} title={metric.name} />
        <div className="flex justify-center gap-12 w-full">
          <kbd className="kbd kbd-lg">◀︎</kbd>
          <kbd className="kbd kbd-lg">Swipe</kbd>
          <kbd className="kbd kbd-lg">▶︎</kbd>
        </div>
      </Modal>
    </div>
  )
}
