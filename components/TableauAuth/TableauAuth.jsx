import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useMetrics } from '../../models/Metrics';

export default function TableauAuth() {
  const [userID, setUserID] = useState(undefined);
  const res = useSession();
  const metrics = useMetrics(userID);

  useEffect(() => {
    if (res.status === 'authenticated') {
      console.log('res', res);
      setUserID('a3302788-5406-4ab7-bbe3-e2dd39b9eb6f');
    }
  }, [res.status]);

  if (res.status === 'authenticated') {
    return (
      <>
        {res.data.user.name} is {res.status} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <>
      User is {res.status} <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
