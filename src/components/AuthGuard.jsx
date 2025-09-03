"use client";

import { useEffect } from 'react';
import { signOut, signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import { useSessionTimeout } from 'hooks';

const killSession = async (queryClient, router, demo, base_path) => {
  try {
    // Invalidate all tableau-related queries
    await queryClient.invalidateQueries({
      queryKey: ['tableau'],
      refetchType: 'none',
    });

    // Clear all cached data
    await queryClient.clear();

    if (demo === 'documentation') {
      // sign the user out without redirecting to standard auth page
      await signOut({ redirect: false });
      await signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
    } else {
      const authUrl = `${base_path}/auth`;

      // sign the user out without redirecting to standard auth page
      await signOut({ redirect: false });
      // redirect to local demo /auth page
      router.push(authUrl);
    }
  } catch (error) {
    console.error('Error during session cleanup:', error);
    // Force redirect even if cleanup fails
    if (demo === 'documentation') {
      router.push('/');
    } else {
      const authUrl = `${base_path}/auth`;
      router.push(authUrl);
    }
  }
}

export const AuthGuard = (props) => {
  const { demo, base_path } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { status: session_status, data: session_data } = useSession({ required: false });

  const signedIn = session_status === 'authenticated';
  const signedOut = session_status === 'unauthenticated';

  // Use session timeout hook to handle automatic logout
  useSessionTimeout(demo, base_path);

  useEffect(() => {
    if (signedOut) {
      if (demo === 'documentation') {
        signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
      } else {
        killSession(queryClient, router, demo, base_path);
      }
    }
    if (signedIn) {
      if (demo === 'documentation' && session_data.user.demo !== 'documentation') {
        killSession(queryClient, router, demo, base_path);
      } else if (demo !== session_data.user.demo) {
        killSession(queryClient, router, demo, base_path);
      }
    }

  }, [ signedIn, signedOut, demo, session_data, queryClient, router, base_path ]);
}
