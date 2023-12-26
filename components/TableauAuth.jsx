import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMetrics } from '../models/Metrics';

export default function TableauAuth() {
  const [userID, setUserID] = useState(undefined);
  const sesh = useSession();
  const metrics = useMetrics(userID);

  useEffect(() => {
    if (sesh.status === 'authenticated') {
      setUserID('a3302788-5406-4ab7-bbe3-e2dd39b9eb6f');
    }
  }, [sesh]);

  if (sesh.status === 'authenticated') {
    return (
      <>
        <p className="nx-font-bold mt-4">{sesh.data.user.name} is {sesh.status}</p> 
        <button className="nx-text-xl nx-font-bold" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      <p className="nx-font-bold mt-4">User is {sesh.status}</p> 
      <button className="nx-text-xl nx-font-bold" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
