import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia a react-dom/client
import './styles/loginPage.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Crea la raíz con createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
