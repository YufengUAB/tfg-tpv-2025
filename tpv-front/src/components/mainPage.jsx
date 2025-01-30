import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMesasActivas } from '../services/mesaService';
import { useUser } from '../context/userContext';
import '../styles/mainPage.css';

const MainPage = () => {
  const [mesa, setMesa] = useState(''); 
  const [mesasActivas, setMesasActivas] = useState([]); 
  
  const navigate = useNavigate(); 
  const { userData } = useUser(); 

  // Redirige al login si no hay datos de usuario.
  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  // Obtiene las mesas activas de la API al cargar el componente.
  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const mesas = await getMesasActivas(); 
        setMesasActivas(mesas); 
      } catch (error) {
        console.error('Error al obtener mesas activas:', error); 
      }
    };

    fetchMesas(); 

    // Actualiza las mesas activas cada 10 segundos.
    const intervalId = setInterval(fetchMesas, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Navega a la página de la mesa seleccionada.
  const toMesaPage = (mesa) => {
    navigate(`/mesa/${mesa}`);
  };

  // Agrega un número al número de mesa seleccionado.
  const handleNumpadClick = (value) => {
    setMesa((prevMesa) => prevMesa + value);
  };

  // Elimina el último carácter del número de mesa.
  const handleBackspace = () => {
    setMesa((prevMesa) => prevMesa.slice(0, -1));
  };

  // Confirma el número de mesa seleccionado y navega a la página correspondiente.
  const handleConfirm = () => {
    if (mesa) {
      navigate(`/mesa/${mesa}`);
    } else {
      alert('Por favor selecciona un número de mesa.');
    }
  };

  // Navega a la página de configuración (solo si el usuario es root).
  const handleConfigClick = () => {
    navigate('/opcion');
  };

  // Navega a la página de facturación.
  const handleFacturaClick = () => {
    navigate('/factura');
  };

  return (
    <div className="main-container">
      {/* Muestra las mesas activas obtenidas de la API */}
      <div className="mesas-section">
        {mesasActivas.map((mesaActiva) => (
          <button
            key={mesaActiva.id}
            onClick={() => toMesaPage(mesaActiva.numero)} // Redirige a la página de la mesa al hacer clic.
            className={mesaActiva.estado === 2 ? 'mesa-button-estado-2' : 'mesa-button'}
          >
            {mesaActiva.numero} {/* Muestra el número de la mesa */}
          </button>
        ))}
      </div>

      {/* Numpad para seleccionar el número de mesa */}
      <div className="numpad-section">
        <input
          type="text"
          value={mesa} // Muestra el número de mesa seleccionado.
          readOnly // No editable directamente por el usuario.
          className="mesa-display"
          placeholder="Número de mesa"
        />
        {/* Numpad: botones para los números del 0 al 9 */}
        <div className="numpad-buttons">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button key={num} onClick={() => handleNumpadClick(num)}>
              {num}
            </button>
          ))}
        </div>

        {/* Botones para eliminar el último número o confirmar */}
        <div className="numpad-actions">
          <button onClick={handleBackspace}>←</button>
          <button onClick={handleConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
