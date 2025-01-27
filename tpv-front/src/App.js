import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/loginPage.jsx'; 
import MainPage from './components/mainPage.jsx'; 
import FacturaPage from './components/facturaPage.jsx';
import MesaPage from './components/mesaPage.jsx';
import { UserProvider } from './context/userContext';
import OpcionPage from './components/opcionPage.jsx';

const App = () => {
  useEffect(() => {
    document.title = 'TPV'; 
  }, []);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} /> 
          <Route path="/mesa/:mesa" element={<MesaPage />} /> 
          <Route path="/opcion" element={<OpcionPage />} /> 
          <Route path="/factura" element={<FacturaPage/>} />
          <Route path="/" element={<Navigate to="/login" />} /> 
        </Routes>
      </Router>
    </UserProvider>
    
  );
};

export default App;
