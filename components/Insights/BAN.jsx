import { useEffect } from "react";
import VegaLiteViz from "../VegaLiteViz";
import { parseBan } from "../../utils/parse";
import bundle from "../../models/Insights/mocks/generate_current_metric_value_insight_bundle.json"

// returns a minimal representation for the UI
function BAN(props) {
  const setMetricValue = props.setMetricValue;
  const parsedBundle = parseBan(bundle);
  const { value, question, markup, viz  } = parsedBundle[0];

  useEffect(() => {
    // the metric value is controlled in the parent component but set here
    setMetricValue(value);
  }, [value, setMetricValue]);

  return (
    <>
    <div className='flex items-end p-4'>
      <h1 className='flex-0 font-bold text-3xl text-stone-800'>
        {props.title}:
      </h1>
      <p className='flex-1 font-bold text-3xl text-stone-600 mx-2'>{value}</p>
    </div>
    {Object.entries(viz).length === 0 ? <></> : <VegaLiteViz height={104} spec={viz}></VegaLiteViz>}
    <p dangerouslySetInnerHTML={{__html: question}} />
    <p dangerouslySetInnerHTML={{__html: markup}} />
    </>
  )
}

export default BAN;
