import { createContext, useContext, useState } from "react";

const AuthContext = createContext({ usuario: null });

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data) => {
    localStorage.setItem("usuario", JSON.stringify(data));
    setUsuario(data);
  };

  const logout = () => {
    localStorage.clear(); 
    setUsuario(null);
  };


  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
