import { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
const UserContext = createContext(null);

// Custom hook para usar el contexto
export const useUser = () => useContext(UserContext);

// Proveedor del contexto del usuario
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Obtener el valor inicial desde localStorage (si existe)
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  // Efecto para actualizar localStorage cuando cambie userData
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      localStorage.removeItem('userData'); // Eliminar si no hay datos
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
