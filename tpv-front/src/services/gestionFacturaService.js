import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/gestionfactura';

export const getFacturas = async () => {
    try {
        const response = await axios.get(`${API_URL}/getFactura`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información de las facturas:', error);
        throw error;
    }
}

export const getFacturaByFecha = async (fecha) => {
    try {
        const response = await axios.get(`${API_URL}/getFacturaByFecha/${fecha}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información de las facturas:', error);
        throw error;
    }
}

export const getFacturaByFechaRange = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/getFacturaByFecha/${startDate}/${endDate}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la información de las facturas por rango de fechas:', error);
        throw error;
    }
}
