"use client";

import { signOut } from "next-auth/react";
import { QueryClient } from "@tanstack/react-query";

import { useTableauSession } from '@/hooks';

const killSession = async () => {
  // Invalidate the useTableauSession query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  await queryClient.invalidateQueries(
    {
      queryKey: ['tableau'],
      refetchType: 'none',
    }
  );

  // sign the user out
  signOut({redirect: false});
}

export const AuthGuard = (props) => {
  const { demo } = props;
  // tanstack query hook to safely represent users on the client
  const {
    status: sessionStatus,
    data: user,
    error: sessionError,
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    isLoading: isSessionLoading
  } = useTableauSession();

  // const { status: session_status, data: session_data } = useSession({ required: false });

  if (isSessionError) {
    console.debug('Tableau Auth Error:', sessionError);
  }

  if (isSessionSuccess) {
    console.log('*** demo ***', demo);
    console.log('*** user.demo ***', user.demo);
    if (demo != user.demo) {
      killSession();
    }
  }

  // console.log('*** session_data ***', session_data);
}
