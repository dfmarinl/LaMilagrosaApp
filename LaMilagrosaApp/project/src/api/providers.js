import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/providers';

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Crear nuevo proveedor
 * POST /providers
 */
export const createProvider = async (providerData) => {
  try {
    const response = await axios.post(
      `${API_URL}`,
      providerData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
};

export const getAllProviders = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

export const updateProvider = async (providerId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${providerId}`,
      updatedData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

export const deleteProvider = async (providerId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${providerId}`,
      { headers: getAuthHeaders() }
    );
    console.log('Proveedor eliminado correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
};