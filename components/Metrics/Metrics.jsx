import VegaLiteViz from '../VegaLiteViz/VegaLiteViz'
import Model from './libs/model'
import PowerLevel from './mocks/PowerLevel/PowerLevel.json'
import Subscriptions from './mocks/All/Subscriptions.json'
import ScopedMetrics from './mocks/All/ScopedMetrics.json'
import CoreMetrics from './mocks/All/CoreMetrics.json'


const parseInsights = (metric) => {
  const insights = {};
  metric.result.insight_groups.forEach(group => {
    insights[group.type] = group;
  });
  return insights;
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

function Metrics(props) {
  const insights = parseInsights(PowerLevel);

  const metrics = new Model('session', Subscriptions, ScopedMetrics, CoreMetrics);

  return (
    <>
    <BAN insights={insights} />
    <Top insights={insights} />
    </>
  )
}

export default Metrics;

