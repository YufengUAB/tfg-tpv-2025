// components/opcionForms/CrearUsuario.js
import React, { useState } from 'react';
import { createUser } from '../../services/usuarioService';
import { toast } from 'react-toastify';

const CrearUsuario = ({ onUsuarioCreated }) => {
  const [usuarioData, setUsuarioData] = useState({
    nombre: '',
    password: '',
    rol: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioData({ ...usuarioData, [name]: value });
  };

  const handleCreateUsuario = async (e) => {
    e.preventDefault();
    try {
      await createUser(usuarioData);
      setUsuarioData({ nombre: '', password: '', rol: '' });
      onUsuarioCreated && onUsuarioCreated(); 
      toast.success('Usuario creado con éxito');
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      toast.error('Error al crear el usuario');
    }
  };

  return (
    <form className='form-container' onSubmit={handleCreateUsuario}>
      <h2>Crear Usuario</h2>
      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={usuarioData.nombre}
        onChange={handleInputChange}
        required
      />
      <label>Contraseña:</label>
      <input
        type="password"
        name="password"
        value={usuarioData.password}
        onChange={handleInputChange}
        required
      />
      <label>Rol:</label>
      <select
        name="rol"
        value={usuarioData.rol}
        onChange={handleInputChange}
        required
      >
        <option value="">Seleccionar rol</option>
        <option value="rootUser">Root</option>
        <option value="usuario">Usuario</option>
      </select>
      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearUsuario;
