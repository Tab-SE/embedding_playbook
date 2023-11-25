import { useSession, signIn, signOut } from "next-auth/react"

export default function TableauAuth() {
  // documented here: https://next-auth.js.org/getting-started/client#usesession
  // const { data: session } = useSession();
  const res = useSession();

  if (res.status === 'authenticated') {
    console.log('res', res);
    return (
      <>
        {res.data.user.name} is {res.status} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      User is {res.status} <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
