import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

function FiltersBtn(props) {
  return (
    <button 
    className="btn bg-sf-indigo btn-circle border-none outline-none text-white hover:text-sf-indigo" 
    onClick={()=>props.modal.showModal()}>
      <FontAwesomeIcon icon={faFilter} size='2xl' />
    </button>
  )
}

function Download(props) {
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const modal = ref.current;

  return (
    <>
      <FiltersBtn modal={modal} />
      <dialog id="my_modal_2" className="modal" ref={ref}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl">
            <FontAwesomeIcon icon={faFilter} size='lg' />
            <span className='m-4'>Filters</span>
          </h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Download;
