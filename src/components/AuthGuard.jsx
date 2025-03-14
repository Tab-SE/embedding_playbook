"use client";

import { useEffect } from 'react';
import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';

import { useTableauSession } from '@/hooks';


const killSession = async (queryClient, router, demo) => {
  // Invalidate the useTableauSession query
  await queryClient.invalidateQueries(
    {
      queryKey: ['tableau'],
      refetchType: 'none',
    }
  );

  const callbackUrl = `/demo/${demo}`;
  const authUrl = `/demo/${demo}/auth`;

  // sign the user out and redirect to demo /auth page
  signOut({ redirect: false, callbackUrl: callbackUrl });
  router.push(authUrl);
}

export const AuthGuard = (props) => {
  const { demo } = props;
  const router = useRouter();
  const queryClient = useQueryClient();
  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  useEffect(() => {
    if (isSessionSuccess && demo !== user.demo) {
      killSession(queryClient, router, demo);
    }
  }, [isSessionSuccess, demo, user, queryClient, router]);

  if (isSessionError) {
    console.debug('Tableau Auth Error:', sessionError);
  }
}
