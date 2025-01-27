import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/pedido';

export const getPedido = async (mesaId) => {
  try {   
    const response = await axios.get(`${API_URL}/mesa/${mesaId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error; 
  }
};

export const getPedidos = async () => {
  try {
    const response = await axios.get(`${API_URL}/pedidos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
}

export const updatePedido = async (pedido) => {
  try {
    const response = await axios.post(`${API_URL}/update`, pedido);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    throw error;
  }
}
