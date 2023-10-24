import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloud, faTruckFast } from '@fortawesome/free-solid-svg-icons'

function VerticalsMenu() {
  return (
    <div className="card-body">
      <span className="font-bold text-lg dark:text-neutral">6 Items</span>
      <span className="text-info">Subtotal: $712.40</span>
      <div className="card-actions">
        <button className="btn btn-primary btn-block">View cart</button>
      </div>
    </div>
  )
}

function Vertical(props) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} >
        <a className="btn btn-ghost normal-case text-xl outline-transparent text-white">
          <span className='fa-stack'>
            <FontAwesomeIcon icon={faCloud} className='fa-stack-2x text-primary' />
            <FontAwesomeIcon icon={faTruckFast} className='fa-stack-1x text-white' />
          </span>
          Superstore Analytics
        </a>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
      </div>
    </div>
  )
}

export default Vertical;
