'use client'

import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

import { AuthGuard, LanggraphAgentRuntimeProvider } from '@/components';
import { settings } from './config';

import '../global.css';


export default function RootLayout({ children }) {
  const [ queryClient ] = useState(() => new QueryClient());

  useEffect(() => {
    // @ts-ignore
    window.toggleDevtools = () => setShowDevtools((old) => !old)
  }, []);

  return (
    <html lang="en">
      <body className='h-screen w-screen'>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider
              attribute="data-theme"
              forcedTheme='superstore'
              enableSystem={false}
              themes={[ 'superstore' ]}
            >
              <LanggraphAgentRuntimeProvider
                agentId='a585b681-26dd-5c0a-b77f-47a0e69b1bbd'
              >
                <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left'/>
                <AuthGuard demo={settings.app_id} />
                {children}
              </LanggraphAgentRuntimeProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
