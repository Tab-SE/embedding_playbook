"use client";

import { useEffect } from 'react';
import { signOut, signIn, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

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
  const queryClient = useQueryClient();

  const { status: session_status, data: session_data } = useSession({ required: false });

  const signedIn = session_status === 'authenticated';
  const signedOut = session_status === 'unauthenticated';

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
