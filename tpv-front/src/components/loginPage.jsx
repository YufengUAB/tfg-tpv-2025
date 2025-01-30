import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authService from '../services/authService'; 
import { useUser } from '../context/userContext'; 

const LoginPage = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const { setUserData } = useUser(); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  // Este hook se ejecuta al cargar la página y limpia el estado de usuario
  useEffect(() => {
    setUserData(null); 
  }, [setUserData]);

  // Función que maneja el evento de envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setLoading(true); 

    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      setLoading(false); 
      return;
    }

    try {
      const data = await authService.login(username, password);
      console.log('Inicio de sesión exitoso:', data);

      setUserData(data);

      navigate('/main'); 

      setError(''); 
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Inicio de Sesión</h2>
        {/* Si hay un error, lo muestra */}
        {error && <p className="error-message">{error}</p>}

        {/* Campo de nombre de usuario */}
        <div className="input-group">
          <label>Nombre de Usuario:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} // Actualiza el estado cuando cambia el valor
            required 
          />
        </div>

        {/* Campo de contraseña */}
        <div className="input-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} // Actualiza el estado cuando cambia el valor
            required 
          />
        </div>

        {/* Botón de submit que cambia a "Cargando..." mientras espera */}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
