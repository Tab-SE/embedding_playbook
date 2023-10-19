import Tableau from '../tableau/tableau'
import Toolbar from './toolbar/toolbar'


function Analytics(props) {


  return (
    <section className='bg-sfneutral80 dark:bg-sfneutral95 rounded'>
      <Toolbar/>
      <Tableau
        vizUrl={props.vizUrl}
        height={props.height}
        width={props.width}
        hideTabs={props.hideTabs}
        device={props.device}
      />
    </section>
  )
}

export default Analytics;
