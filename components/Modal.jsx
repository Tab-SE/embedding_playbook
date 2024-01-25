import { useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'


function Modal(props) {
  const setModal = props.setModal;
  // useRef accesses DOM nodes created with the render method https://reactjs.org/docs/refs-and-the-dom.html
  const ref = useRef(null); 

  useEffect(() => {
    // the modal is controlled in the parent component but set here
    setModal(ref.current);
  }, [ref, setModal]);


  return (
    <>
      <dialog id="tab_modal" className="modal" ref={ref}>
        <div className="modal-box md:max-w-5xl bg-stone-100 dark:bg-stone-300">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost absolute right-2 top-2 outline-none">
              <FontAwesomeIcon icon={faCircleXmark} size='2xl' />
            </button>
          </form>
          <div>
            {props.children}
          </div>
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
