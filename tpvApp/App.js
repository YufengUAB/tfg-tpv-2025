import React from 'react';
import { UserProvider } from './context/userContext';  // Asegúrate de que la ruta de importación sea correcta
import AppNavigation from './navigation/AppNavigation';  // Tu componente de navegación
import { IPProvider } from './context/ipContext';  // Asegúrate de que la ruta de importación sea correcta

const App = () => {
  return (
    <IPProvider>
      <UserProvider>
        <AppNavigation/>
      </UserProvider>
    </IPProvider>
  );
};

export default App;
