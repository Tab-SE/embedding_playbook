import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMetrics } from '../models/Metrics';

export default function TableauAuth() {
  const [userID, setUserID] = useState(undefined);
  // const { status, data } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     // The user is not authenticated, handle it here.
  //   },
  // })
  const sesh = useSession();
  const metrics = useMetrics(userID);

  useEffect(() => {
    if (sesh.status === 'authenticated') {
      setUserID('a3302788-5406-4ab7-bbe3-e2dd39b9eb6f');
      console.log('metrics for user:', sesh.data.user);
    }
  }, [sesh]);

  if (sesh.status === 'loading') {
    return (
      <>
        <p className="nx-font-bold m-4">{sesh.status}</p> 
        <button className="btn glass" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  if (sesh.status === 'authenticated') {
    return (
      <>
        <p className="nx-font-bold m-4">{sesh.data.user.name} is {sesh.status}</p> 
        <button className="btn glass" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <p className="nx-font-bold m-4">User is {sesh.status}</p> 
      <button className="btn glass" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
