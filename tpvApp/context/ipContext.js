import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Creamos el contexto
const IPContext = createContext();

// Proveedor del contexto
export const IPProvider = ({ children }) => {
  const [ipAddress, setIpAddress] = useState('');

  // Recuperamos la IP desde AsyncStorage cuando el componente se monta
  useEffect(() => {
    const loadIP = async () => {
      try {
        const storedIP = await AsyncStorage.getItem('ipAddress');
        if (storedIP) {
          setIpAddress(storedIP);
        }
      } catch (error) {
        console.error("Error al cargar la IP", error);
      }
    };
    loadIP();
  }, []);

  // Guardamos la IP en AsyncStorage cuando se cambia
  const saveIpAddress = async (newIP) => {
    try {
      await AsyncStorage.setItem('ipAddress', newIP);
      setIpAddress(newIP);
    } catch (error) {
      console.error("Error al guardar la IP", error);
    }
  };

  return (
    <IPContext.Provider value={{ ipAddress, setIpAddress: saveIpAddress }}>
      {children}
    </IPContext.Provider>
  );
};

// Hook para acceder al contexto
export const useIP = () => {
  const context = useContext(IPContext);
  if (!context) {
    throw new Error("useIP debe ser usado dentro de un IPProvider");
  }
  return context;
};
