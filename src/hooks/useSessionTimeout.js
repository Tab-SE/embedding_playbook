"use client";

import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Hook to handle session timeout and automatic logout
 * Monitors session expiration and automatically logs out users when sessions expire
 */
export const useSessionTimeout = (demo, base_path) => {
  const { data: session, status } = useSession({ required: false });
  const queryClient = useQueryClient();
  const router = useRouter();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set up timeout if user is authenticated
    if (status === 'authenticated' && session?.expires) {
      const now = new Date();
      const expires = new Date(session.expires);
      const timeUntilExpiry = expires.getTime() - now.getTime();

      // If session is already expired, logout immediately
      if (timeUntilExpiry <= 0) {
        handleSessionExpiry();
        return;
      }

      // Set timeout for 5 minutes before expiry to show warning
      const warningTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
      if (warningTime > 0) {
        warningTimeoutRef.current = setTimeout(() => {
          showSessionWarning();
        }, warningTime);
      }

      // Set timeout for actual expiry
      timeoutRef.current = setTimeout(() => {
        handleSessionExpiry();
      }, timeUntilExpiry);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [session, status, demo, base_path]);

  const handleSessionExpiry = async () => {
    try {
      console.log('Session expired, logging out user');

      // Invalidate all queries
      await queryClient.invalidateQueries({
        queryKey: ['tableau'],
        refetchType: 'none',
      });

      // Sign out without redirect
      await signOut({ redirect: false });

      // Handle different demo types
      if (demo === 'documentation') {
        // For documentation, redirect to home
        router.push('/');
      } else {
        // For other demos, redirect to auth page
        const authUrl = `${base_path}/auth`;
        router.push(authUrl);
      }
    } catch (error) {
      console.error('Error during session expiry logout:', error);
      // Force redirect even if logout fails
      if (demo === 'documentation') {
        router.push('/');
      } else {
        const authUrl = `${base_path}/auth`;
        router.push(authUrl);
      }
    }
  };

  const showSessionWarning = () => {
    // You can customize this to show a modal or notification
    console.warn('Session will expire in 5 minutes');

    // Optional: Show a browser notification or modal
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Session Expiring Soon', {
          body: 'Your session will expire in 5 minutes. Please save your work.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  return {
    isSessionExpired: status === 'authenticated' && session?.expires && new Date(session.expires) <= new Date(),
    timeUntilExpiry: status === 'authenticated' && session?.expires
      ? Math.max(0, new Date(session.expires).getTime() - new Date().getTime())
      : 0
  };
};
