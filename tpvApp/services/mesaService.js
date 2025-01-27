import axios from 'axios';

const HTTP = 'http://';
const API_URL = ':8080/api/v1/mesa';

export const getMesasActivas = async (ipAddress) => {
    try {
      const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/mesasAbiertas`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las mesas activas:', error);
      throw error;
    }
};

export const getMesaByNombre = async (mesaName, ipAddress) => {
    try {
      const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/mesaAbierto/${mesaName}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la mesa:', error);
      throw error;
    }
}

export const updateMesa = async (request, ipAddress) => {
    try {
        const response = await axios.post(`${HTTP}${ipAddress}${API_URL}/update`, request);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la mesa:', error);
        throw error;
    }
}



