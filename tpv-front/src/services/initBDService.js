import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/basicTPV';

export const initBD = async () => {
    try {
        const response = await axios.get(`${API_URL}/initTPV`);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el detalle del pedido:', error);
        throw error;
    }
}
