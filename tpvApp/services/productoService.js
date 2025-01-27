import axios from 'axios';

const HTTP = 'http://';
const API_URL = ':8080/api/v1/producto';

export const getProductos = async (ipAddress) => {
  try {
    const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/productos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las mesas activas:', error);
    throw error;
  }
};

export const createProducto = async (producto) => {
  try {
    const response = await axios.post(`${API_URL}/save`, producto); 
    return response.data; 
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error; 
  }
};

export const getProductosPorCategoria = async (categoriaId) => {
  try {
    const response = await axios.get(`${API_URL}/productoCategoria/${categoriaId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error; 
  }
};

export const deleteProducto = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/delete/${id}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error; 
  }
};

export const updateProducto = async (producto) => {
  try {
    const response = await axios.post(`${API_URL}/update`, producto, { headers: { 'Content-Type': 'application/json' } }); 
    return response.data; 
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error; 
  }
};
