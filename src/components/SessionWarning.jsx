"use client";

import { useState, useEffect } from 'react';
import { Button } from 'components/ui';
import { useSessionTimeout } from 'hooks';

/**
 * Component to show session expiration warning
 * Displays a modal when session is about to expire
 */
export const SessionWarning = ({ demo, base_path }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { timeUntilExpiry } = useSessionTimeout(demo, base_path);

  useEffect(() => {
    // Show warning when less than 5 minutes remain
    if (timeUntilExpiry > 0 && timeUntilExpiry <= 5 * 60 * 1000) {
      setShowWarning(true);
      setTimeLeft(Math.ceil(timeUntilExpiry / 1000));
    } else {
      setShowWarning(false);
    }
  }, [timeUntilExpiry]);

  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    // Refresh the page to extend session
    window.location.reload();
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-2xl mb-4">⏰</div>
          <h3 className="text-lg font-semibold mb-2">Session Expiring Soon</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your session will expire in <span className="font-mono font-bold text-red-600">{formatTime(timeLeft)}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Please save your work. You will be automatically logged out when the session expires.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleExtendSession}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Extend Session
            </Button>
            <Button
              onClick={() => setShowWarning(false)}
              variant="outline"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
