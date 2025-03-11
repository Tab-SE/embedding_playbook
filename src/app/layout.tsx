'use client'

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';
import { SessionProvider, useSession } from 'next-auth/react';

import './global.css';
import { AuthenticatedUserContextProvider} from 'context';
import { AgentRuntimeProvider } from 'components';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, [])

  return (
    <html lang="en">
      <body className='h-screen w-screen'>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left'/>
            <ThemeProvider attribute="class" forcedTheme='light'>
              <AgentRuntimeProvider>
                <AuthenticatedUserContextProvider>
                  <DocumentsSession />
                  {children}
                </AuthenticatedUserContextProvider>
              </AgentRuntimeProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

// Logs users in automatically with the documents demo user (at a minimum has access to superstore)
const DocumentsSession = () => {
  const { status: session_status, data: session_data } = useSession({required: true});
  return <></>
}
