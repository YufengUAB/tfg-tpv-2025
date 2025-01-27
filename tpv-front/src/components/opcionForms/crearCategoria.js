// components/opcionForms/CrearCategoria.js
import React, { useState } from 'react';
import { createCategoria } from '../../services/categoriaService';
import { toast } from 'react-toastify';

const CrearCategoria = () => {
  const [nombre, setNombre] = useState('');

  const handleCreateCategoria = async (e) => {
    e.preventDefault();
    try {
      await createCategoria({ nombre });
      setNombre('');
      toast.success('Categoría creada con éxito');
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      toast.error('Error al crear la categoría');
    }
  };

  return (
    <div>
        <form className="form-container" onSubmit={handleCreateCategoria}>
          <h2>Crear Categoría</h2>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <button type="submit">Crear</button>
        </form>
    </div>

  );
};

export default CrearCategoria;
