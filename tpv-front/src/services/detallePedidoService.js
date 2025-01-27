import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/detallepedido';

export const getAllDetallePedidoById = async (pedidoId) => {
    try {
        const response = await axios.get(`${API_URL}/pedido/${pedidoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el detalle del pedido:', error);
        throw error;
    }
}

export const updateDetallePedido = async (detallePedido) => {
    try {
        const response = await axios.post(`${API_URL}/pedido/updatePedido`, detallePedido);
        return response.data;  
    } catch (error) {
        console.error('Error al actualizar el detalle del pedido:', error);
        throw error;
    }
}