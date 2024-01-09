import { useState } from "react";
import { useInsights } from "../hooks";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const [modal, setModal] = useState(undefined);
  const [metricValue, setMetricValue] = useState(undefined);
  const [qa, setQA] = useState([]); // stores question and answer pairs in an array
  const { name, description } = props.metric;



  const pushQA = (value) => {
    setQA([...qa, value]); // pushes provided values to the Q&A array
  }


  return (
    <div className="stats shadow bg-stone-50 w-52 h-36 cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat">
        <div className="stat-title">{name}</div>
        <div className="stat-value">{metricValue ? metricValue : '0'}</div>
        <div className="stat-desc">21% more than last month</div>
      </div>
      <Modal setModal={setModal} >
        <Insights title={name} value={metricValue} setMetricValue={setMetricValue} qa={qa} pushQA={pushQA} />
        <div className="flex justify-center gap-12 w-full">
          <kbd className="kbd kbd-lg">◀︎</kbd>
          <kbd className="kbd kbd-lg">Swipe</kbd>
          <kbd className="kbd kbd-lg">▶︎</kbd>
        </div>
      </Modal>
    </div>
  )
}