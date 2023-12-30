import BAN  from './BAN'
import Detail from './Detail'
import Springboard from './Springboard'
import PowerLevel from '../../models/Metrics/mocks/PowerLevel/PowerLevel.json'

export default function Insights(props) {
  const insights = parseInsights(PowerLevel);

  return (
    <>
      <BAN insights={insights} title={props.title} />
      <Detail insights={insights} title={props.title} />
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

export { BAN, Detail, Springboard };
