import axios from 'axios';

const HTTP = 'http://';
const API_URL = ':8080/api/v1/categoria';

// Función para obtener todas las categorías
export const getCategorias = async (ipAddress) => {
  try {
    const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/categorias`);
    return response.data; // Devuelve los datos de categorías
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

// Función para obtener las categorías sin productos
export const getCategoriasSinProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/categoriaSinProducto`);
    return response.data; // Devuelve los datos de categorías
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

// Función para crear una nueva categoría
export const createCategoria = async (categoriaData) => {
  try {
    const response = await axios.post(`${API_URL}/save`, categoriaData);
    return response.data; // Devuelve los datos de la categoría creada
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error; // Lanzar el error para manejarlo en el componente
  }
};

// Función para eliminar una categoría
export const deleteCategoria = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/delete/${id}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error; 
  }
};

// Función para actualizar una categoría
export const updateCategoria = async (categoriaData) => {
  try {
    const response = await axios.post(`${API_URL}/update`, categoriaData, { headers: { 'Content-Type': 'application/json' } }); 
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error; 
  }
};
