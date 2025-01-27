import axios from 'axios';

const HTTP = 'http://';
const API_URL = ':8080/api/v1/user';

const authService = {
  login: async (nombre_usuario, password, ipAddress) => {
    const url = `${HTTP}${ipAddress}${API_URL}/login`;

    const requestBody = {
      nombre_usuario: nombre_usuario,
      password: password,
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en la autenticación');
    }
  },
};

export default authService;
