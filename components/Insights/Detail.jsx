import VegaLiteViz from "../VegaLiteViz";

function Detail(props) {
  const summaries = props.insights?.top?.summaries[0]?.result;
  const insights = props.insights?.top?.insights[0]?.result;
  const viz = insights?.viz;
  const markup = insights?.markup;
  const value = insights?.facts?.target_period_value?.formatted;
  const label = insights?.facts?.target_period_value?.label;

  return (
    <p dangerouslySetInnerHTML={{__html: markup}} /> 
  )
}

export default Detail;