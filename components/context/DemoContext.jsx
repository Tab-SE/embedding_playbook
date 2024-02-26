import { createContext, useState } from 'react';

export const DemoContext = createContext();

export const DemoContextProvider = ({ children }) => {
  const [demo, setDemo] = useState('minimized');

  return (
    <DemoContext.Provider value={{ demo, setDemo }}>
      {children}
    </DemoContext.Provider>
  );
};
