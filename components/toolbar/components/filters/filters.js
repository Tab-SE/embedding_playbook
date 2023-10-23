import { useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Categories from './components/categories/categories'

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

// <button className="btn btn-outline btn-secondary w-32 justify-self-end">Reset</button>
// <button 
//   className="btn btn-outline btn-primary w-32 justify-self-end"
// >
//   Apply All
// </button>

  return (
    <>
      <FiltersBtn modal={modal} />
      <dialog id="my_modal_2" className="modal" ref={ref}>
        <div className="modal-box md:max-w-xl lg:max-w-3xl xl:max-w-5xl bg-sf-neutral-80">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost absolute right-2 top-2 outline-none">
              <FontAwesomeIcon icon={faCircleXmark} size='2xl' />
            </button>
          </form>
          <div className='grid grid-flow-col grid-cols-3 auto-rows-max mr-10'>
            <h3 className="font-bold text-3xl mb-9">
              <FontAwesomeIcon icon={faFilter} size='lg' />
              <span className='p-4'>Filters</span>
            </h3>
          </div>
          <Categories viz={props.viz} interactive={props.interactive} />
          <p className="pt-6 text-sm">(Press <kbd className="kbd">ESC</kbd> key or click outside to close)</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Filters;
