import BAN  from './BAN'
import Detail from './Detail'
import Springboard from './Springboard'
import PowerLevel from '../../models/Metrics/mocks/PowerLevel/PowerLevel.json'

export default function Insights(props) {
  const insights = parseInsights(PowerLevel);

  return (
    <>
      <div className='flex items-end p-4'>
        <h1 className='flex-0 font-bold text-4xl text-stone-800'>
          {props.title}:
        </h1>
        <p className='flex-1 font-bold text-4xl text-stone-600 mx-2'>{props.value}</p>
      </div>
      <div className='my-8' >
        <Detail 
          insights={insights} 
          title={props.title}
          pushQA={props.pushQA} 
          setMetricValue={props.setMetricValue}
        />
      </div>
    </>
  )
}

const parseInsights = (metric) => {
  const insights = {};
  metric.result.insight_groups.forEach(group => {
    insights[group.type] = group;
  });
  return insights;
}
