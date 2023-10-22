import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown, faFileCsv, faFileExcel, 
  faFileImage, faFilePdf, faFilePowerpoint, faFilePen  
} from '@fortawesome/free-solid-svg-icons'

function Option(props) {

  function handleDownload(event) {
    console.log('event', event.target.getAttribute('data-download') );
  }

  return (
    <li onClick={handleDownload} data-download={props.text}>
      <a data-download={props.text}>
        <FontAwesomeIcon 
          icon={props.icon} 
          size='xl' 
          className='pointer-events-none'
        />
        {props.text}
      </a>
    </li>
  )
}

function Menu(props) {
  return (
    <ul className="menu bg-base-200 rounded-box">
      <Option text='All Data' icon={faFileCsv} viz={props.viz} data-download={props.text} />
      <Option text='Chart Data' icon={faFileExcel} viz={props.viz} />
      <Option text='Image' icon={faFileImage} viz={props.viz} />
      <Option text='PDF' icon={faFilePdf} viz={props.viz} />
      <Option text='Powerpoint' icon={faFilePowerpoint} viz={props.viz} />
      <Option text='Workbook' icon={faFilePen} viz={props.viz} />
    </ul>
  )
}

function Download(props) {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className='btn bg-accent btn-circle border-none text-white hover:text-accent'>
        <div className="indicator">
          <FontAwesomeIcon icon={faFileArrowDown} size='2xl' />
        </div>
      </label>
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-40 bg-base-100 shadow">
        <Menu viz={props.viz} />
      </div>
    </div>
  )
}

export default Download;