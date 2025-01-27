import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/gestionmesa';

export const updateDetallePedidoV2 = async (request) => {
    try {
        const response = await axios.post(`${API_URL}/updatePedidoV2`, request);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el detalle del pedido:', error);
        throw error;
    }
}

export const createMesayPedido = async (nMesa, idUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/createMesayPedido/${nMesa}&${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error('Error al crear la mesa:', error);
        throw error;
    }
}

export const dropMesa = async (idMesa, idPedido) => {
    try {
        const response = await axios.get(`${API_URL}/dropMesa/${idMesa}&${idPedido}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la mesa:', error);
        throw error;
    }
}

export const getMesaInfo = async (nMesa) => {
    try {
        const response = await axios.get(`${API_URL}/getMesaInfo/${nMesa}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información de la mesa:', error);
        throw error;
    }
}