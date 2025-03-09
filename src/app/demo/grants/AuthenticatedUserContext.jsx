"use client";

import { createContext, useState } from 'react';

const AuthenticatedUserContext = createContext({
  authenticatedUser: {
    user_id: 'b',
    demo: 'superstore'
  },
  setAuthenticatedUser: () => {}
});

const AuthenticatedUserContextProvider = ({ children }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState({
    user_id: 'b',
    demo: 'superstore'
  });

  return (
    <AuthenticatedUserContext.Provider value={{ authenticatedUser, setAuthenticatedUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

export { AuthenticatedUserContext, AuthenticatedUserContextProvider };
