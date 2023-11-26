// eslint-disable-next-line no-unused-vars
import tab_embed from '../../Tableau/embed_api/embed_api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowDown, faFileCsv, faFileExcel, 
  faFileImage, faFilePdf, faFilePowerpoint, faFilePen  
} from '@fortawesome/free-solid-svg-icons'

function Option(props) {

  async function  handleDownload(event) {
    const option = event.target.getAttribute('data-download');
    try {
      switch(option) {
        case 'All Data':
          await props.viz.displayDialogAsync(tab_embed.TableauDialogType.ExportData);
          break;
        case 'Chart Data':
          await props.viz.displayDialogAsync(tab_embed.TableauDialogType.ExportCrossTab);
          break;
        case 'Image':
          await props.viz.exportImageAsync();
          break;
        case 'PDF':
          await props.viz.displayDialogAsync(tab_embed.TableauDialogType.ExportPDF);
          break;
        case 'Powerpoint':
          await props.viz.displayDialogAsync(tab_embed.TableauDialogType.ExportPowerPoint);
          break;
        case 'Workbook':
          await props.viz.displayDialogAsync(tab_embed.TableauDialogType.ExportWorkbook);
          break;
        default:
          throw new Error('Download Error: does not match TableauDialogType');
      }
    }
    catch (e) {
      console.error('Download Error: ', e.toString());
    }
  }

  return (
    <li onClick={handleDownload} data-download={props.text}>
      <a data-download={props.text} className='text-neutral'>
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
      <Option text='All Data' icon={faFileCsv} viz={props.viz} />
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
