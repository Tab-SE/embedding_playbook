import Img from '../../Img/Img';


function Menu(props) {
  return (
    <>
      <li>
        <a className="justify-between">
          Profile
          <span className="badge badge-accent">New</span>
        </a>
      </li>
      <li><a>Settings</a></li>
      <li><a>Logout</a></li>
    </>
  )
}

function Avatar(props) {
  return (
    <div className="dropdown dropdown-end">
      <span tabIndex={0} >
        <div className="avatar btn btn-circle border-none">
          <div className="w-14 rounded-full">
            <Img 
              src={props.src ? props.src : 'img/img/stock/mackenzie_day.png'}
              alt={props.alt ? props.alt : 'stock user photo'}
              height={props.height ? props.height : 48}
              width={props.width ? props.width : 48}
            />
          </div>
        </div>
      </span>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <Menu />
      </ul>
    </div>
  )
}


export default Avatar;
