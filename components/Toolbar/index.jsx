import Avatar from './components/Avatar'
import Vertical from './components/Verticals'
import Cart  from './components/Cart'
import Download from './components/Download'
import Filters from '../Filters'

function Toolbar(props) {
  
  return (
    <section className='dark:text-neutral'>
      <div className="flex justify-between navbar bg-sf-neutral pr-6 rounded">
        <div className="flex-1">
          <Vertical />
        </div>
        <div className="flex-1 justify-center space-x-10">
          <Filters viz={props.viz} interactive={props.interactive} />
          <Download viz={props.viz} interactive={props.interactive} />
          <Cart />
        </div>
        <div className='flex justify-end'>
          <Avatar
            src="/img/users/mackenzie_day.png"
            alt="sample user"
            height={48}
            width={48}
            className="btn btn-ghost"
          />
        </div>
      </div>
    </section>
  )
}

export default Toolbar;
