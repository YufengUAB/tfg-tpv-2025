import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/user';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data; // Devuelve los datos de categorías
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

export const createUser = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/save`, userData);
      return response.data; // Devuelve los datos de la categoría creada
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error; // Lanzar el error para manejarlo en el componente
    }
};

export const updateUsuario = async (usuarioData) => {
    try {
      const response = await axios.post(`${API_URL}/update`, usuarioData);
      return response.data; // Devuelve los datos de la categoría actualizada
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      throw error; // Lanzar el error para manejarlo en el componente
    }
}

export const deleteUsuario = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/remove/${id}`); 
      return response.data; 
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error; 
    }
  };