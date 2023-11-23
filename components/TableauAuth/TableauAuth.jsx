import { useSession, signIn, signOut } from "next-auth/react"

export default function TableauAuth() {
  // documented here: https://next-auth.js.org/getting-started/client#usesession
  const { data: session } = useSession();
  const res = useSession();

  if (session) {
    console.log('res', res);
    console.log('session', session);
    return (
      <>
        Signed in as {'test'} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
