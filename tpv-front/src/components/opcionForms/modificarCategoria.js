import React, { useEffect, useState } from 'react';
import { updateCategoria, deleteCategoria, getCategorias, getCategoriasSinProductos } from '../../services/categoriaService';
import { toast } from 'react-toastify';
import Modal from 'react-modal'; // Asegúrate de tener react-modal instalado

const ModificarCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSinProductos, setCategoriaSinProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriaToModify, setCategoriaToModify] = useState({
    id_categoria: null,
    nombre: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  useEffect(() => {
    fetchCategorias();
    fetchCategoriasSinProductos();
  }, []);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      toast.error('Error al obtener categorías');
    }
  };

  const fetchCategoriasSinProductos = async () => {
    try {
      const data = await getCategoriasSinProductos();
      setCategoriaSinProductos(data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      toast.error('Error al obtener categorías');
    }
  };

  const handleCategoriaSeleccionada = (categoria) => {
    setCategoriaSeleccionada(categoria.id_categoria);
    setCategoriaToModify({
      id_categoria: categoria.id_categoria,
      nombre: categoria.nombre,
    });
  };

  const handleModifyCategoria = async (e) => {
    e.preventDefault();
    if (categoriaSeleccionada) {
      try {
        await updateCategoria(categoriaToModify);
        toast.success('Categoría modificada con éxito');
        fetchCategorias(); // Refresca la lista de categorías
      } catch (error) {
        console.error('Error al modificar la categoría:', error);
        toast.error('Error al modificar la categoría');
      }
    }
  };

  const handleDeleteCategoria = (categoriaId, categoriaNombre) => {
    setCategoriaAEliminar({ id: categoriaId, nombre: categoriaNombre });
    setModalIsOpen(true); // Abre el modal
  };

  const confirmDelete = async () => {
    if (categoriaAEliminar) {
      try {
        await deleteCategoria(categoriaAEliminar.id);
        fetchCategorias(); // Refrescar categorías después de eliminar
        toast.success(`Categoría "${categoriaAEliminar.nombre}" eliminada con éxito`);
        closeModal(); // Cierra el modal después de eliminar
      } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        toast.error('Error al eliminar la categoría');
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCategoriaAEliminar(null); // Reinicia el estado de categoría a eliminar
  };

  const isCategoriaSinProductos = categoriaSeleccionada && 
                                  categoriaSinProductos.some(cat => cat.id_categoria === categoriaSeleccionada);

  return (
    <div className="form-container">
      <h2>Modificar Categoría</h2>
      <label>Categoría:</label>
      <select onChange={(e) => handleCategoriaSeleccionada(categorias.find(cat => cat.id_categoria === parseInt(e.target.value)))}>
        <option value="">Seleccionar categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id_categoria} value={categoria.id_categoria}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      {categoriaSeleccionada && (
        <form className="form-container" onSubmit={handleModifyCategoria}>
          <label>Nombre:</label>
          <input
            type="text"
            value={categoriaToModify.nombre}
            onChange={(e) => setCategoriaToModify({ ...categoriaToModify, nombre: e.target.value })}
            required
          />
          <button type="submit">Confirmar cambios</button>
          <button 
            type="button" 
            className={`btn-danger ${!isCategoriaSinProductos ? 'btn-disabled' : ''}`} 
            onClick={() => handleDeleteCategoria(categoriaSeleccionada, categoriaToModify.nombre)}
            disabled={!isCategoriaSinProductos} // Desactiva el botón si la categoría no está en las categorías sin productos
          >
            Eliminar categoría
          </button>
          {!isCategoriaSinProductos && (
            <p style={{ color: 'red' }}>
              No se puede eliminar la categoría. Debe tener 0 productos para poder eliminarse.
            </p>
          )}
        </form>
      )}

      {/* Modal de confirmación */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirmar Eliminación"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar la categoría "{categoriaAEliminar?.nombre}"?</p>
        <button onClick={confirmDelete} className="confirm-button-modal">Confirmar</button>
        <button onClick={closeModal} className="cancel-button-modal">Cancelar</button>
      </Modal>
    </div>
  );
};

export default ModificarCategoria;
