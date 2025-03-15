"use client";

import { useEffect } from 'react';
import { signOut, signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

const killSession = async (queryClient, router, demo) => {
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
    const callbackUrl = `/demo/${demo}`;
    const authUrl = `/demo/${demo}/auth`;

    // sign the user out without redirecting to standard auth page
    signOut({ redirect: false, callbackUrl: callbackUrl });
    // redirect to local demo /auth page
    router.push(authUrl);
  }
}

export const AuthGuard = (props) => {
  const { demo } = props;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { status: session_status, data: session_data } = useSession({ required: false });

  const signedIn = session_status === 'authenticated';
  const signedOut = session_status === 'unauthenticated';

  useEffect(() => {
    if (signedOut) {
      if (demo === 'documentation') {
        signIn('demo-user', { redirect: false, ID: 'a', demo: 'documentation' });
      } else {
        killSession(queryClient, router, demo);
      }
    }
    if (signedIn) {
      if (demo === 'documentation' && session_data.user.demo !== 'documentation') {
        killSession(queryClient, router, 'documentation');
      } else if (demo !== session_data.user.demo) {
        killSession(queryClient, router, demo);
      }
    }

  }, [ signedIn, signedOut, demo, session_data, queryClient, router ]);
}
