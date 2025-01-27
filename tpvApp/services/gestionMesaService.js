import axios from 'axios';

const HTTP = 'http://';
const API_URL = ':8080/api/v1/gestionmesa';

export const updateDetallePedidoV2 = async (request, ipAddress) => {
    try {
        const response = await axios.post(`${HTTP}${ipAddress}${API_URL}/updatePedidoV2`, request);
        console.log('response.data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el detalle del pedido:', error);
        throw error;
    }
}

export const createMesayPedido = async (nMesa, idUsuario, ipAddress) => {
    try {
        const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/createMesayPedido/${nMesa}&${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error('Error al crear la mesa:', error);
        throw error;
    }
}

export const dropMesa = async (idMesa, idPedido, ipAddress) => {
    try {
        const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/dropMesa/${idMesa}&${idPedido}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la mesa:', error);
        throw error;
    }
}

export const getMesaInfo = async (nMesa, ipAddress) => {
    try {
        const response = await axios.get(`${HTTP}${ipAddress}${API_URL}/getMesaInfo/${nMesa}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información de la mesa:', error);
        throw error;
    }
}