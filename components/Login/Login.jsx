import { useSession, signIn, signOut } from "next-auth/react"

export default function Login() {
  // documented here: https://next-auth.js.org/getting-started/client#usesession
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
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
