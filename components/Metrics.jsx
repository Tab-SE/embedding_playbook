import Insights from './Insights'
import { useMetrics } from '../hooks';

function Metrics(props) {

  return (
    <Insights title={props.title} />
  )
}

export default Metrics;
