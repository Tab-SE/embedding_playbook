import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown, faFileCsv, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFilePen  } from '@fortawesome/free-solid-svg-icons'

function Menu(props) {
  return (
    <ul className="menu bg-base-200 w-56 rounded-box">
      <li><a><FontAwesomeIcon icon={faFileCsv} size='xl' />All Data</a></li>
      <li><a><FontAwesomeIcon icon={faFileExcel} size='xl' />Chart Data</a></li>
      <li><a><FontAwesomeIcon icon={faFileImage} size='xl' />Image</a></li>
      <li><a><FontAwesomeIcon icon={faFilePdf} size='xl' />PDF</a></li>
      <li><a><FontAwesomeIcon icon={faFilePowerpoint} size='xl' />Powerpoint</a></li>
      <li><a><FontAwesomeIcon icon={faFilePen} size='xl' />Workbook</a></li>
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
      <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
        <Menu />
      </div>
    </div>
  )
}

export default Download;