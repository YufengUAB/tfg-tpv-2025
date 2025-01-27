// components/opcionForms/CrearProducto.js
import React, { useState, useEffect } from 'react';
import { createProducto } from '../../services/productoService';
import { getCategorias } from '../../services/categoriaService';
import { toast } from 'react-toastify';

const CrearProducto = () => {
  const [categorias, setCategorias] = useState([]);
  const [newProducto, setNewProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    cantidad_stock: '0'
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        toast.error('Error al obtener categorías');
      }
    };

    fetchCategorias();
  }, []);

  const handleCreateProducto = async (e) => {
    e.preventDefault();
    try {
      await createProducto(newProducto);
      setNewProducto({ nombre: '', precio: '', categoria: '', cantidad_stock: '' });
      toast.success('Producto creado con éxito');
    } catch (error) {
      console.error('Error al crear el producto:', error);
      toast.error('Error al crear el producto');
    }
  };

  return (
    <form className="form-container" onSubmit={handleCreateProducto}>
      <h2>Crear Producto</h2>
      <label>Nombre:</label>
      <input
        type="text"
        value={newProducto.nombre}
        onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
        required
      />
      <label>Precio:</label>
      <input
        type="number"
        value={newProducto.precio}
        onChange={(e) => setNewProducto({ ...newProducto, precio: e.target.value })}
        required
      />
      <label>Categoría:</label>
      <select
        value={newProducto.categoria}
        onChange={(e) => setNewProducto({ ...newProducto, categoria: e.target.value })}
        required
      >
        <option value="">Seleccionar categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id_categoria} value={categoria.id_categoria}>
            {categoria.nombre}
          </option>
        ))}
      </select>
      <button type="submit">Crear</button>
    </form>
  );
};

export default CrearProducto;
