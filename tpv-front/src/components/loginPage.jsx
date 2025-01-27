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

  useEffect(() => {
    setUserData(null);
  }, [setUserData]);

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
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label>Nombre de Usuario:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="input-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
