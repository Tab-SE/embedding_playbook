import { useState, useEffect } from "react";
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const [modal, setModal] = useState(undefined);

  const { name, description } = props.metric;

  console.log('Metric:', props.status, props.metric);

  return (
    <div className="stats shadow bg-stone-50 w-52 h-36 cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat">
        <div className="stat-title">{name}</div>
        <div className="stat-value">89,400</div>
        <div className="stat-desc">21% more than last month</div>
      </div>
      <Modal title={name} icon={faChartLine} setModal={setModal}>
        <Insights title={name} />
      </Modal>
    </div>
  )
}