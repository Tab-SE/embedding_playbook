import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

function Toggle(props) {
  return (
    <>
    {props.icon ? <FontAwesomeIcon icon={faFilter} className='text-white'/> : <>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      <span className="badge badge-secondary badge-sm indicator-item">9</span>
    </>}
    </>
  )
}

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

function TButton(props) {
  // dynamic styles with reasonable defaults
  const btnColor = 'btn-' + props.color ? props.color : 'primary';
  const btnStyle = 'btn-' + props.style ? props.style : 'circle';

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className={`btn ${btnColor} ${btnStyle}`}>
        <div className="indicator">
          <Toggle icon={props.icon} iconColor={props.iconColor} />
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
      </div>
    </div>
  )
}

export default TButton;