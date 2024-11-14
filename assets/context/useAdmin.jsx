import { createContext, useState } from "react";

export const AdminContext = createContext({
  isAdmin: false,
  toggleAdmin: () => {},
});

export function AdminContextProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleAdmin = () => {
    setIsAdmin(true);
  };
  return (
    <AdminContext.Provider value={{ isAdmin, toggleAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}
