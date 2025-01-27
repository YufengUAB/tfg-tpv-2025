import axios from 'axios';

const authService = {
  login: async (nombre_usuario, password) => {
    const url = 'http://localhost:8080/api/v1/user/login';

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
