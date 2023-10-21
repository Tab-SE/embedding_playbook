import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

function Menu(props) {
  return (
    <div className="card-body">
      <span className="font-bold text-lg">6 Items</span>
      <span className="text-info">Subtotal: $712</span>
      <div className="card-actions">
        <button className="btn btn-primary btn-block">View cart</button>
      </div>
    </div>
  )
}

function Download(props) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className='btn bg-sfindigo btn-circle border-none text-white hover:text-sfindigo'>
        <div className="indicator">
          <FontAwesomeIcon icon={faFilter} size='2xl' />
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <Menu />
      </div>
    </div>
  )
}

export default Download;