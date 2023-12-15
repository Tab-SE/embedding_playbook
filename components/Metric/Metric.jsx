import VegaLiteViz from '../VegaLiteViz/VegaLiteViz'
import CoreMetric from './PowerLevel/CoreMetric.json'
import PowerLevel from './PowerLevel/PowerLevel.json'

const ParseMetric = () => {
  const title = CoreMetric.input.metric.metadata.name;
}


function BAN(props) {
  const summaries = props.insights.ban.summaries[0].result;
  const insights = props.insights.ban.insights[0].result;
  const viz = summaries?.viz;
  const markup = insights?.markup;
  const value = insights?.facts?.target_period_value?.formatted;
  const label = insights?.facts?.target_period_value?.label;

  return (
    <>
    <div className='flex items-end p-4'>
      <h1 className='flex-0 nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
        {props.title}
      </h1>
      <p className='flex-1 nx-text-4xl mx-4'>{value}</p>
    </div>
    <VegaLiteViz height={104} spec={viz}></VegaLiteViz>
    <p dangerouslySetInnerHTML={{__html: markup}} />
    </>
  )
}

function Top(props) {
  const summaries = props.insights?.top?.summaries[0]?.result;
  const insights = props.insights?.top?.insights[0]?.result;
  const viz = insights?.viz;
  const markup = insights?.markup;
  const value = insights?.facts?.target_period_value?.formatted;
  const label = insights?.facts?.target_period_value?.label;

  return (
    <>
     <div className='flex items-end p-4'>
      <h1 className='flex-0 nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100'>
        {props.title}
      </h1>
      <p className='flex-1 nx-text-4xl mx-4'>{value}</p>
    </div>
    <VegaLiteViz height={104} spec={viz}></VegaLiteViz>
    <p dangerouslySetInnerHTML={{__html: markup}} /> 
    </>
  )
}

function Metric(props) {
  const insights = parseInsights(PowerLevel);

  return (
    <>
    <BAN insights={insights} />
    <Top insights={insights} />
    </>
  )
}

export default Metric;

const parseInsights = (metric) => {
  const insights = new Object;
  metric.result.insight_groups.forEach(group => {
    insights[group.type] = group;
  });
  return insights;
}
