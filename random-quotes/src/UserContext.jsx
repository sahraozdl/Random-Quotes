import { createContext, useState } from "react";

export const UserContext= createContext();
export const UserDispatchContext = createContext();

export const UserProvider = ({initialValue, children}) => {
  const [user, setUser] = useState(initialValue);
  return (
    <UserContext.Provider value={user}>
      <UserDispatchContext.Provider value={setUser}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}