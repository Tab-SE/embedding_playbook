import { createContext, useState } from 'react';

// passes user information to <Demo/> and other components
const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { status: session_status, data: session_data } = useSession({});

  useEffect(() => {
    if (session_status === 'authenticated') {
      setUser(session_data.user.name);
    } else if (session_status === 'unauthenticated') {
      setUser(null); // Reset user state if not authenticated
    }
  }, [session_status, session_data]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };


// controls minimized and maximized HeroDemo state
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
