"use client";

import { useEffect } from 'react';
import { signOut, signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from 'next/navigation';
import { useTableauSession } from '@/hooks';

const killSession = async (queryClient, router, demo, base_path) => {
  // Invalidate the useTableauSession query
  await queryClient.invalidateQueries(
    {
      queryKey: ['tableau'],
      refetchType: 'none',
    }
  );

  if (demo === 'documentation') {
    // sign the user out without redirecting to standard auth page
    signOut({ redirect: false, callbackUrl: '/' });
    signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
  } else {
    const authUrl = `${base_path}/auth`;

    // sign the user out without redirecting to standard auth page
    signOut({ redirect: false, callbackUrl: base_path });
    // redirect to local demo /auth page
    router.push(authUrl);
  }
}

export const AuthGuard = (props) => {
  const { demo, base_path } = props;
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { status: session_status, data: session_data } = useSession({ required: false });
  const { 
    data: tableauSession, 
    isError: tableauError, 
    isSuccess: tableauSuccess,
    isLoading: tableauLoading
  } = useTableauSession();

  const signedIn = session_status === 'authenticated';
  const signedOut = session_status === 'unauthenticated';
  const isAuthPage = pathname === `${base_path}/auth`;

  useEffect(() => {
    // If on auth page, don't redirect
    if (isAuthPage) {
      return;
    }

    // If not signed in, redirect to auth
    if (signedOut) {
      if (demo === 'documentation') {
        signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
      } else {
        killSession(queryClient, router, demo, base_path);
      }
      return;
    }

    // If signed in but wrong demo
    if (signedIn) {
      if (demo === 'documentation' && session_data.user.demo !== 'documentation') {
        killSession(queryClient, router, demo, base_path);
        return;
      } else if (demo !== 'documentation' && demo !== session_data.user.demo) {
        killSession(queryClient, router, demo, base_path);
        return;
      }
    }

    // Check for Tableau token after session is established
    // Only check if we're signed in and not loading
    if (signedIn && !tableauLoading && !isAuthPage) {
      // If Tableau session query has errored or succeeded but no token exists
      if (tableauError || (tableauSuccess && (!tableauSession || !tableauSession.embed_token))) {
        // Redirect to auth page to get a new token
        const authUrl = `${base_path}/auth`;
        router.push(authUrl);
      }
    }

  }, [ 
    signedIn, 
    signedOut, 
    demo, 
    session_data, 
    queryClient, 
    router, 
    base_path,
    tableauSession,
    tableauError,
    tableauSuccess,
    tableauLoading,
    isAuthPage
  ]);
}
