import React, { useState, useEffect } from 'react';
import { updateProducto, deleteProducto, getProductosPorCategoria } from '../../services/productoService';
import { getCategorias } from '../../services/categoriaService';
import { toast } from 'react-toastify';

const ModificarProducto = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoToModify, setProductoToModify] = useState({
    id_producto: null,
    nombre: '',
    precio: 0,
    categoria: 0,
    cantidad_stock: 0 // Inicialmente como 0
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

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await getProductosPorCategoria(categoriaSeleccionada);
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        toast.error('Error al obtener productos');
      }
    };
  
    if (categoriaSeleccionada) {
      fetchProductos();
    }
  }, [categoriaSeleccionada]);

  const handleProductoSeleccionado = (producto) => {
    setProductoSeleccionado(producto.id_producto);
    setProductoToModify({
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      categoria: producto.categoria,
      cantidad_stock: producto.cantidad_stock // Mantenerlo como número
    });
  };

  const handleModifyProducto = async (e) => {
    e.preventDefault();
    if (productoSeleccionado) {
      try {
        await updateProducto(productoToModify);
        toast.success('Producto modificado con éxito');
      } catch (error) {
        console.error('Error al modificar el producto:', error);
        toast.error('Error al modificar el producto');
      }
    }
  };

  const handleDeleteProducto = async () => {
    if (productoSeleccionado) {
      try {
        await deleteProducto(productoSeleccionado);
        setProductoSeleccionado(null);
        setProductoToModify({ id_producto: null, nombre: '', precio: 0, categoria: 0, cantidad_stock: 0 }); // Reiniciar campos
        toast.success('Producto eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        toast.error('Error al eliminar el producto');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Modificar Producto</h2>
      <label>Categoría:</label>
      <select onChange={(e) => setCategoriaSeleccionada(e.target.value)} required>
        <option value="">Seleccionar categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id_categoria} value={categoria.id_categoria}>
            {categoria.nombre}
          </option>
        ))}
      </select>
      {categoriaSeleccionada && (
        <div className="form-container">
          <label>Producto:</label>
          <select onChange={(e) => handleProductoSeleccionado(productos.find(prod => prod.id_producto === parseInt(e.target.value)))}>
            <option value="">Seleccionar producto</option>
            {productos.map((producto) => (
              <option key={producto.id_producto} value={producto.id_producto}>
                {producto.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
      {productoSeleccionado && (
        <form className="form-container" onSubmit={handleModifyProducto}>
          <label>Nombre:</label>
          <input
            type="text"
            value={productoToModify.nombre}
            onChange={(e) => setProductoToModify({ ...productoToModify, nombre: e.target.value })}
            required
          />
          <label>Precio:</label>
          <input
            type="number"
            value={productoToModify.precio}
            onChange={(e) => setProductoToModify({ ...productoToModify, precio: parseFloat(e.target.value) })}
            required
          />
          <label>Categoría:</label>
          <select 
            value={productoToModify.categoria}
            onChange={(e) => setProductoToModify({ ...productoToModify, categoria: parseInt(e.target.value) })}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          <label>Cantidad en Stock:</label>
          <input
            type="number"
            value={productoToModify.cantidad_stock}
            onChange={(e) => setProductoToModify({ ...productoToModify, cantidad_stock: parseInt(e.target.value) })} // Asegúrate de que sea un entero
            required
          />
          <button type="submit">Confirmar cambios</button>
          <button type="button" className="btn-danger" onClick={handleDeleteProducto}>Eliminar producto</button>
        </form>
      )}
    </div>
  );
};

export default ModificarProducto;
