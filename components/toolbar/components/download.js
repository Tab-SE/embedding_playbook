import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown } from '@fortawesome/free-solid-svg-icons'

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
  // dynamic styles with reasonable defaults
  const btnColor = 'btn-' + props.color ? props.color : 'primary';
  const btnStyle = 'btn-' + props.style ? props.style : 'circle';

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={`btn ${btnColor} ${btnStyle}`}>
        <div className="indicator">
          <FontAwesomeIcon icon={faFileArrowDown} className='text-white' size='2xl' />
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <Menu />
      </div>
    </div>
  )
}

export default Download;