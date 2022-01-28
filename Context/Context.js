import { useState } from "react";
import React from "react";

const userContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <userContext.Provider value={(user, setUser)}>
      {children}
    </userContext.Provider>
  );
};
