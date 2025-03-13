"use client";

import { signOut } from "next-auth/react";
import { QueryClient } from "@tanstack/react-query";

import { useTableauSession } from '@/hooks';

export const AuthGuard = async (props) => {
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

  console.log('*** user ***', sessionStatus, isSessionLoading, user);

  if (isSessionSuccess) {
    if (demo != user.demo) {
      console.log('*** user ***', user);
      // Invalidate the useTableauSession query
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
          },
        },
      })

      // queryClient.invalidateQueries({ queryKey: ["tableau"] });

      await queryClient.invalidateQueries(
        {
          queryKey: ['tableau'],
          exact,
          refetchType: 'active',
        },
        { throwOnError, cancelRefetch },
      )
      // sign the user out
      signOut();
    }
  }

  // console.log('*** session_data ***', session_data);
}
