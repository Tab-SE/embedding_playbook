import { useSession, signIn, signOut } from "next-auth/react"

export default function TableauAuth() {
  // documented here: https://next-auth.js.org/getting-started/client#usesession
  const { data: session } = useSession();
  const res = useSession();

  console.log('res', res);

  if (session) {
    console.log('res', res);
    console.log('session', session);
    return (
      <>
        Status is {res.status} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Status is {res.status} <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
