import PowerLevel from '../models/Metrics/mocks/PowerLevel/PowerLevel.json'
import Detail from './Detail';
import BAN from './BAN'


function Metrics(props) {
  const insights = parseInsights(PowerLevel);

  return (
    <>
    <BAN insights={insights} />
    <Detail insights={insights} />
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


export default Metrics;
