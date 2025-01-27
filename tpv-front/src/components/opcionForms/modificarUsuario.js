import React, { useEffect, useState } from 'react';
import { updateUsuario, deleteUsuario, getUsers } from '../../services/usuarioService.js';
import { toast } from 'react-toastify';
import Modal from 'react-modal'; 

const ModificarUsuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioToModify, setUsuarioToModify] = useState({
    id_usuario: null,
    nombre_usuario: '',
    password: '',
    rol: 'usuario', // Valor por defecto
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await getUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      toast.error('Error al obtener usuarios');
    }
  };

  const handleUsuarioSeleccionado = (usuario) => {
    setUsuarioSeleccionado(usuario.id_usuario);
    setUsuarioToModify({
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      password: usuario.password,
      rol: usuario.rol,
    });
  };

  const handleModifyUsuario = async (e) => {
    e.preventDefault();
    if (usuarioSeleccionado) {
      try {
        await updateUsuario(usuarioToModify);
        toast.success('Usuario modificado con éxito');
        fetchUsuarios(); // Refresca la lista de usuarios
      } catch (error) {
        console.error('Error al modificar el usuario:', error);
        toast.error('Error al modificar el usuario');
      }
    }
  };

  const handleDeleteUsuario = (usuarioId, usuarioNombre) => {
    setUsuarioAEliminar({ id: usuarioId, nombre: usuarioNombre });
    setModalIsOpen(true); // Abre el modal
  };

  const confirmDelete = async () => {
    if (usuarioAEliminar) {
      try {
        await deleteUsuario(usuarioAEliminar.id);
        fetchUsuarios(); // Refrescar usuarios después de eliminar
        toast.success(`Usuario "${usuarioAEliminar.nombre}" eliminado con éxito`);
        closeModal(); // Cierra el modal después de eliminar
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setUsuarioAEliminar(null); // Reinicia el estado de usuario a eliminar
  };

  return (
    <div className="form-container">
      <h2>Modificar Usuario</h2>
      <label>Usuario:</label>
      <select onChange={(e) => handleUsuarioSeleccionado(usuarios.find(user => user.id_usuario === parseInt(e.target.value)))}>
        <option value="">Seleccionar usuario</option>
        {usuarios.map((usuario) => (
          <option key={usuario.id_usuario} value={usuario.id_usuario}>
            {usuario.nombre_usuario}
          </option>
        ))}
      </select>

      {usuarioSeleccionado && (
        <form className="form-container" onSubmit={handleModifyUsuario}>
          <label>Nombre:</label>
          <input
            type="text"
            value={usuarioToModify.nombre_usuario}
            onChange={(e) => setUsuarioToModify({ ...usuarioToModify, nombre_usuario: e.target.value })}
            required
          />
          <label>Contraseña:</label>
          <input
            type="text"
            value={usuarioToModify.password}
            onChange={(e) => setUsuarioToModify({ ...usuarioToModify, password: e.target.value })}
            required
          />
          <label>Rol:</label>
          <select
            value={usuarioToModify.rol}
            onChange={(e) => setUsuarioToModify({ ...usuarioToModify, rol: e.target.value })}
            required
          >
            <option value="usuario">Usuario</option>
            <option value="rootUser">Root User</option>
          </select>
          <button type="submit">Confirmar cambios</button>
          <button type="button" className="btn-danger" onClick={() => handleDeleteUsuario(usuarioSeleccionado, usuarioToModify.nombre_usuario)}>
            Eliminar usuario
          </button>
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
        <p>¿Estás seguro de que deseas eliminar el usuario "{usuarioAEliminar?.nombre}"?</p>
        <button onClick={confirmDelete} className="confirm-button-modal">Confirmar</button>
        <button onClick={closeModal} className="cancel-button-modal">Cancelar</button>
      </Modal>
    </div>
  );
};

export default ModificarUsuario;
