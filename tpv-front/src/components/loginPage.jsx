import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authService from '../services/authService'; // Importa el servicio de autenticación
import { useUser } from '../context/userContext'; // Importa el contexto para manejar el estado de usuario

const LoginPage = () => {
  // Declaración de los estados locales
  const [username, setUsername] = useState(''); // Estado para el nombre de usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const { setUserData } = useUser(); // Obtener la función para actualizar el contexto de usuario
  const [error, setError] = useState(''); // Estado para mostrar posibles errores
  const [loading, setLoading] = useState(false); // Estado para indicar si la solicitud está en proceso
  const navigate = useNavigate(); // Hook para navegar entre las páginas

  // Este hook se ejecuta al cargar la página y limpia el estado de usuario
  useEffect(() => {
    setUserData(null); // Restablece cualquier dato de usuario previo
  }, [setUserData]);

  // Función que maneja el evento de envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario (recarga de la página)
    setLoading(true); // Activa el estado de carga

    // Verifica si los campos están vacíos y muestra un error si es el caso
    if (!username || !password) {
      setError('Por favor, completa todos los campos');
      setLoading(false); // Detiene la carga
      return;
    }

    try {
      // Intenta autenticar al usuario usando el servicio de autenticación
      const data = await authService.login(username, password);
      console.log('Inicio de sesión exitoso:', data);

      // Si la autenticación es exitosa, actualiza el estado del usuario
      setUserData(data);

      // Redirige a la página principal
      navigate('/main'); 

      setError(''); // Limpia el mensaje de error en caso de éxito
    } catch (error) {
      // Si ocurre un error, muestra un mensaje de error
      setError('Error al iniciar sesión: ' + error.message);
    } finally {
      // Finaliza el estado de carga
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
