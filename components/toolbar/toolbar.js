import Avatar from './components/avatar'
import Vertical from './components/verticals'
import Cart  from './components/cart'
import Download from './components/download'
import Filter from './components/filter'

function Toolbar(props) {

  return (
    <section>
      <div className="flex justify-between navbar bg-sfneutral mt-8 pr-6 rounded">
        <div className="flex-1">
          <Vertical />
        </div>
        <div className="flex-1 justify-center space-x-10">
          <Filter viz={props.viz} />
          <Download viz={props.viz} />
          <Cart />
        </div>
        <div className='flex justify-end'>
          <Avatar
            src="img/stock/mackenzie_day.png"
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