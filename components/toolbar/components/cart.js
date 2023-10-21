import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

function Menu() {
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

function Cart() {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn bg-sfblue btn-circle border-none text-white hover:text-sfblue">
        <div className="indicator">
          <FontAwesomeIcon icon={faCartShopping} size='2xl' />
          <span className="badge badge-secondary badge-sm indicator-item">6</span>
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <Menu />
      </div>
    </div>
  )
}

export default Cart;
