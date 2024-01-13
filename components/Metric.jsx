import { useState } from "react";
import { useBan } from "../hooks";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric } = props;
  const [modal, setModal] = useState(undefined);
  let result; // contains question, markup and facts
  let facts; // contains values, changes
  // tanstack query hook
  const { status, data, error, isError, isSuccess } = useBan(metric);

  if (isError) {
    console.debug(error);
  }

  if (isSuccess) {
    // BAN responses only have 1 insight_groups and 1 insights
    result = data?.bundle_response?.result.insight_groups[0].insights[0].result; 
    facts = result?.facts;
  }

  return (
    <div className="stats shadow bg-stone-50 w-60 cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat">
        <div className="stat-title whitespace-normal">{metric.name}</div>
        <div className="stat-value whitespace-normal mt-2 mb-3">{facts ? facts.target_period_value.formatted : '0'}</div>
        <div className="stat-desc whitespace-normal">{result ? result.markup : 'Querying Insights...'}</div>
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

