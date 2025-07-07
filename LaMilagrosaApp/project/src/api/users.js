import axios from 'axios';

export async function getAllUsers() {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.get('http://localhost:8080/api/v1/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data; // Retorna la lista de usuarios
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    
    // Manejar errores específicos
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar storage como lo hace tu AuthContext
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para acceder a esta información.');
    }
    
    throw error;
  }
}

export async function deleteUserById(id) {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('Token de autenticación no encontrado');
    }

    const response = await axios.delete(`http://localhost:8080/api/v1/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data; // Devuelve la respuesta del backend (puede ser vacío o un mensaje)
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${id}:`, error);

    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }

    if (error.response?.status === 403) {
      throw new Error('No tienes permisos para eliminar este usuario.');
    }

    if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado.');
    }

    throw error;
  }
}