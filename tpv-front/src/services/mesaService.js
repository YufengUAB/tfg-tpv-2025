import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/mesa';

export const getMesasActivas = async () => {
    try {
      const response = await axios.get(`${API_URL}/mesasAbiertas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las mesas activas:', error);
      throw error;
    }
};

export const getMesaByNombre = async (mesaName) => {
    try {
      const response = await axios.get(`${API_URL}/mesaAbierto/${mesaName}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la mesa:', error);
      throw error;
    }
}

export const updateMesa = async (request) => {
    try {
        const response = await axios.post(`${API_URL}/update`, request);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la mesa:', error);
        throw error;
    }
}



