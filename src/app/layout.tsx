'use client'

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';

import './global.css';
import { AgentRuntimeProvider } from 'components';
import { AuthenticatedUserContextProvider } from 'context';

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
