// api/auth.js
import axios from 'axios';

export async function login(email, password) {
  try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', {
      email,
      password,
    });

    const token = response.data.token;
    if (token) {
      localStorage.setItem('authToken', token);
       localStorage.setItem('userEmail', email);
    } else {
      console.warn('No se recibió token en la respuesta');
    }

    return response.data; // Puedes devolver todo el objeto o solo el token, como prefieras
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error; // Para que el componente que llame a login pueda manejar el error
  }
}



export const register = async (data) => {
  try {
    console.log('Datos que se envían:', data);
    const response = await axios.post(
      'http://localhost:8080/api/v1/auth/register',
      data,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('Respuesta del backend:', response.data);
    return true;
  } catch (error) {
    console.error('Error al registrar:', error.response?.data || error);
    return false;
  }
};
