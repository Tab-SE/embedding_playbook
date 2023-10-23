import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import Categories from './components/categories'

function FiltersBtn(props) {
  return (
    <button 
    className="btn bg-sf-indigo btn-circle border-none outline-none text-white hover:text-sf-indigo" 
    onClick={()=>props.modal.showModal()}>
      <FontAwesomeIcon icon={faFilter} size='2xl' />
    </button>
  )
}

function Filters(props) {
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  const modal = ref.current;

  return (
    <>
      <FiltersBtn modal={modal} />
      <dialog id="my_modal_2" className="modal" ref={ref}>
        <div className="modal-box md:max-w-xl lg:max-w-3xl xl:max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none">✕</button>
          </form>
          <h3 className="font-bold text-3xl mb-9">
            <FontAwesomeIcon icon={faFilter} size='lg' />
            <span className='p-4'>Filters</span>
          </h3>
          <Categories />
          <p className="pt-6 text-xs">(Press <kbd className="kbd">ESC</kbd> key or click outside to close)</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Filters;
