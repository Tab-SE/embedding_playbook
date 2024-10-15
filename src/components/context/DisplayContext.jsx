"use client";
import { createContext, useState } from 'react';

const DisplayContext = createContext('minimized');

const DisplayContextProvider = ({ children }) => {
  const [display, setDisplay] = useState('minimized');

  return (
    <DisplayContext.Provider value={{ display, setDisplay }}>
      {children}
    </DisplayContext.Provider>
  );
};

export { DisplayContext, DisplayContextProvider };
