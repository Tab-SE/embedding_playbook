import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMetrics } from '../models/Metrics';

export default function TableauAuth() {
  const [userID, setUserID] = useState(undefined);
  const { status, data } = useSession({
    required: true, // only 2 states: loading and authenticated https://next-auth.js.org/getting-started/client#require-session
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
      // => This component should wrap all other Tableau components: https://next-auth.js.org/getting-started/client#require-session
    },
  })
  // const sesh = useSession();
  const metrics = useMetrics(userID);

  useEffect(() => {
    if (status === 'authenticated') {
      setUserID(data.user.name);
    }
  }, [status, data]);

  if (status === 'authenticated') {
    return (
      <>
        <p className="nx-font-bold m-4">{data.user.name} is {status}</p> 
        <button className="btn glass" onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  // 'loading' state is the default because session.required === true: https://next-auth.js.org/getting-started/client#require-session
  return (
    <>
      <p className="nx-font-bold m-4">User is unauthenticated</p> 
      <button className="btn glass" onClick={() => signIn()}>Sign in</button>
    </>
  );
}
