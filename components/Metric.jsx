import { useState } from "react";
import { useBan } from "../hooks";
import Modal from "./Modal";
import Insights from "./Insights";


export default function Metric(props) {
  const { metric, metricStatus } = props;
  const [modal, setModal] = useState(undefined);
  const [metricValue, setMetricValue] = useState(undefined);
  const [ban, setBan] = useState(undefined);
  const [banStatus, setBanStatus] = useState('loading');
  const { name, description } = metric;

  // syncs with user metric generated insights - many metrics, one resource - optimized for homepage
  const banQuery = useBan(metric).then((result) => {
    const { status, data, error, isError, isSuccess } = result;
    if (isError) {
      setBanStatus(status);
      console.debug(error);
    }
    if (isSuccess) {
      setBanStatus(status);
      setBan(data);
    }
   });

  return (
    <div className="stats shadow bg-stone-50 w-52 h-36 cursor-pointer" onClick={()=> modal ? modal.showModal() : false }>
      <div className="stat">
        <div className="stat-title">{name}</div>
        <div className="stat-value">{metricValue ? metricValue : '0'}</div>
        <div className="stat-desc">21% more than last month</div>
      </div>
      <Modal setModal={setModal} >
        <Insights metric={metric} title={name} value={metricValue} setMetricValue={setMetricValue} ban={ban} />
        <div className="flex justify-center gap-12 w-full">
          <kbd className="kbd kbd-lg">◀︎</kbd>
          <kbd className="kbd kbd-lg">Swipe</kbd>
          <kbd className="kbd kbd-lg">▶︎</kbd>
        </div>
      </Modal>
    </div>
  )
}