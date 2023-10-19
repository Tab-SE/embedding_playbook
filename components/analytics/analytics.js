import Tableau from '../tableau/tableau'
import Toolbar from './toolbar/toolbar'


function Analytics(props) {


  return (
    <>
      <Toolbar/>
      <Tableau
        vizUrl={props.vizUrl}
        height={props.height}
        width={props.width}
        hideTabs={props.hideTabs}
        device={props.device}
      />
    </>
  )
}

export default Analytics;
