import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Importa AsyncStorage

// Crear el contexto
const UserContext = createContext(null);

// Custom hook para usar el contexto
export const useUser = () => useContext(UserContext);

// Proveedor del contexto del usuario
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Intentar obtener el valor de AsyncStorage
        const savedUserData = await AsyncStorage.getItem('userData');
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };

    loadUserData();
  }, []);

  // Efecto para actualizar AsyncStorage cuando cambie userData
  useEffect(() => {
    if (userData) {
      AsyncStorage.setItem('userData', JSON.stringify(userData));  // Guardar en AsyncStorage
    } else {
      AsyncStorage.removeItem('userData');  // Eliminar si no hay datos
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
