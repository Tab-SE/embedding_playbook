import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'


function Modal(props) {
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 
  // the modal is controlled in the parent component but set here
  props.setModal(ref.current);

  return (
    <>
      <dialog id="tab_modal" className="modal" ref={ref}>
        <div className="modal-box md:max-w-xl lg:max-w-3xl xl:max-w-5xl bg-sf-white dark:bg-sf-neutral-80">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost absolute right-2 top-2 outline-none">
              <FontAwesomeIcon icon={faCircleXmark} size='2xl' />
            </button>
          </form>
          <div>
            <h3 className="font-bold text-3xl mb-9">
              <span className='p-4'>{props.title}</span>
            </h3>
          </div>
          {props.children}
          <p className="pt-6 text-sm">(Press <kbd className="kbd">ESC</kbd> key or click outside to close)</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default Modal;
