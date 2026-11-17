"use client";

import { useEffect } from 'react';

export const OAuthGuard = () => {
  useEffect(() => {
    fetch('/api/tableau/oauth/status')
      .then(r => r.json())
      .then(({ ready, required }) => {
        if (required && !ready) {
          window.location.href = `/api/tableau/oauth?return_to=${encodeURIComponent(window.location.pathname)}`;
        }
      })
      .catch(() => {});
  }, []);

  return null;
};
