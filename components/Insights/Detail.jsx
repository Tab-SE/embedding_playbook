import { useEffect } from "react";
import { parseBan } from "../../utils/parse";
import bundle from "../../models/Insights/mocks/generate_detail_insight.json"

function Detail(props) {
  const summaries = props.insights?.top?.summaries[0]?.result;
  const insights = props.insights?.top?.insights[0]?.result;
  const viz = insights?.viz;
  const markup = insights?.markup;
  const value = insights?.facts?.target_period_value?.formatted;
  const label = insights?.facts?.target_period_value?.label;

  // returns a minimal representation for the UI
  const parsedBundle = parseBan(bundle);
  // const { value, question, markup, viz  } = parsedBundle[0];

  // console.log('parsedDetail', parsedBundle);

  useEffect(() => {
    // the metric value is controlled in the parent component but set here
    props.pushQA(value);
  }, [value]);

  return (
    <p dangerouslySetInnerHTML={{__html: markup}} /> 
  )
}

export default Detail;