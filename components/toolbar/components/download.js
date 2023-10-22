import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown, faFileCsv, faFileExcel, 
  faFileImage, faFilePdf, faFilePowerpoint, faFilePen  
} from '@fortawesome/free-solid-svg-icons'

function Option(props) {
  return (
    <li><a><FontAwesomeIcon icon={props.icon} size='xl'/>{props.text} </a></li>
  )
}

function Menu(props) {
  return (
    <ul className="menu bg-base-200 rounded-box">
      <Option icon={faFileCsv} text='All Data' />
      <Option icon={faFileExcel} text='Chart Data' />
      <Option icon={faFileImage} text='Image' />
      <Option icon={faFilePdf} text='PDF' />
      <Option icon={faFilePowerpoint} text='Powerpoint' />
      <Option icon={faFilePen} text='Workbook' />
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
        <Menu />
      </div>
    </div>
  )
}

export default Download;