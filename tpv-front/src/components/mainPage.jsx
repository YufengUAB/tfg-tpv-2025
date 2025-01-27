import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMesasActivas } from '../services/mesaService';
import { useUser } from '../context/userContext'; 
import '../styles/mainPage.css';

const MainPage = () => {
  const [mesa, setMesa] = useState('');
  const [mesasActivas, setMesasActivas] = useState([]);
  const navigate = useNavigate();
  const { userData } = useUser(); // Obtener el valor de userData desde el contexto

  // Verifica si no hay un usuario y redirige a /login
  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  // Llama a la API para obtener las mesas activas cada cierto tiempo (por ejemplo, cada 10 segundos)
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

    const intervalId = setInterval(fetchMesas, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const toMesaPage = (mesa) => {
    navigate(`/mesa/${mesa}`);
  };

  const handleNumpadClick = (value) => {
    setMesa((prevMesa) => prevMesa + value);
  };

  const handleBackspace = () => {
    setMesa((prevMesa) => prevMesa.slice(0, -1));
  };

  const handleConfirm = () => {
    if (mesa) {
      navigate(`/mesa/${mesa}`);
    } else {
      alert('Por favor selecciona un número de mesa.');
    }
  };

  const handleConfigClick = () => {
    navigate('/opcion');
  };

  const handleFacturaClick = () => {
    navigate('/factura');
  };

  return (
    <div className="main-container">
      <div className="mesas-section">
        {mesasActivas.map((mesaActiva) => (
          <button
            key={mesaActiva.id}
            onClick={() => toMesaPage(mesaActiva.numero)}
            className={mesaActiva.estado === 2 ? 'mesa-button-estado-2' : 'mesa-button'}
          >
            {mesaActiva.numero}
          </button>

        ))}
      </div>

      <div className="numpad-section">
        <input
          type="text"
          value={mesa}
          readOnly
          className="mesa-display"
          placeholder="Número de mesa"
        />

        <div className="numpad-wrapper">
          <div className="letters-column">
            {['A', 'B', 'C', 'D'].map((letter) => (
              <button
                key={letter}
                onClick={() => handleNumpadClick(letter)}
                className="numpad-button"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="numbers-column">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumpadClick(number.toString())}
                className="numpad-button"
              >
                {number}
              </button>
            ))}
            <button onClick={() => handleNumpadClick('#')} className="numpad-button">
              #
            </button>
            <button onClick={() => handleNumpadClick('0')} className="numpad-button">
              0
            </button>
            <button onClick={() => handleNumpadClick('*')} className="numpad-button">
              *
            </button>
          </div>

          <div className="actions">
            <button onClick={handleBackspace} className="numpad-button action-button"> ← </button>
            <button onClick={handleConfirm} className="numpad-button action-button confirm-button"> ↵ </button>
            <button onClick={handleFacturaClick} className="numpad-button action-button confirm-button"> 📜 </button>
            {userData && userData.rol === 'rootUser' && (
              <button
                onClick={handleConfigClick}
                className="numpad-button action-button config-button"
              >
                ⚙️
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
