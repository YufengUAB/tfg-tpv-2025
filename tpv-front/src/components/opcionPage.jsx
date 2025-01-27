// pages/OpcionPage.js
import React, { useState } from 'react';
import '../styles/opcionPage.css';
import CrearCategoria from '../components/opcionForms/crearCategoria.js';
import ModificarCategoria from './opcionForms/modificarCategoria.js';
import CrearProducto from '../components/opcionForms/crearProducto.js';
import ModificarProducto from '../components/opcionForms/modificarProducto.js';
import CrearUsuario from '../components/opcionForms/crearUsuario.js';
import ModificarUsuario from './opcionForms/modificarUsuario.js';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InitBDButton from '../components/opcionForms/initBD.js';

const OpcionPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  return (
    <div className="opcion-page-container">
      <div className="opciones-section">
        <button onClick={() => setSelectedOption('crearCategoria')}>Crear Categoría</button>
        <button onClick={() => setSelectedOption('eliminarCategoria')}>Modificar Categoría</button>
        <button onClick={() => setSelectedOption('crearProducto')}>Crear Producto</button>
        <button onClick={() => setSelectedOption('modificarProducto')}>Modificar Producto</button>
        <button onClick={() => setSelectedOption('cusuarios')}>Crear Usuarios</button>
        <button onClick={() => setSelectedOption('musuarios')}>Modificar Usuarios</button>
        <button onClick={() => navigate('/main')} className="volver-button">Volver</button>
        <button onClick={() => setSelectedOption('initBD')} className="init-bd-button">Inicializar BD</button>
      </div>
      <div className="form-section">
        {selectedOption === 'crearCategoria' && <CrearCategoria />}
        {selectedOption === 'eliminarCategoria' && <ModificarCategoria />}
        {selectedOption === 'crearProducto' && <CrearProducto />}
        {selectedOption === 'modificarProducto' && <ModificarProducto />}
        {selectedOption === 'cusuarios' && <CrearUsuario />}
        {selectedOption === 'musuarios' && <ModificarUsuario />}
        {selectedOption === 'initBD' && <InitBDButton />}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OpcionPage;
