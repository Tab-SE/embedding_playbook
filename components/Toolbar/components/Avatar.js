import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image'



function Menu(props) {
  const [user, setUser] = useState(undefined);
  // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
  const { status, data } = useSession({ required: false })

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(data.user.name);
    }
  }, [status, data]);

  if (status === 'authenticated') {
    return (
      <div>
        <li>
          <a className="justify-between">
            Profile
            <span className="badge badge-accent">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a><button onClick={() => signOut()}>Sign out</button></a></li>
      </div> 
    );
  }

  // 'loading' state is the default because session.required === true: https://next-auth.js.org/getting-started/client#require-session
  return (
    <div>
      <li>
        <a className="justify-between">
          Profile
          <span className="badge badge-accent">New</span>
        </a>
      </li>
      <li><a>Settings</a></li>
      <li><a><button onClick={() => signIn()}>Sign in</button></a></li>
    </div>
  );
}



function Avatar(props) {
  return (
    <div className="dropdown dropdown-end">
      <span tabIndex={0} >
        <div className="avatar btn btn-circle border-none">
          <div className="w-14 rounded-full">
            <Image 
              src={props.src ? props.src : '/img/users/mackenzie_day.png'}
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
