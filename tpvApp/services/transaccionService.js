import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/transaccion';

export const getTransaccion = async (pedidoId) => {
  try {   
    const response = await axios.get(`${API_URL}/pedido/${pedidoId}`); 
    return response.data; 
  } catch (error) {
    console.error('Error al pedir las transacciones:', error);
    throw error; 
  }
};

export const saveTransaccion = async (transaccion) => {
    try {
        const response = await axios.post(`${API_URL}/save`, transaccion);
        return response.data;
    } catch (error) {
        console.error('Error al guardar la transaccion:', error);
        throw error;
    }
};

