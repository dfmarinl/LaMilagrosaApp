import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/inventory';

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // igual que en productos
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Obtener inventario por ID de producto
 * GET /inventory/{productId}
 */
export const getInventoryByProductId = async (productId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${productId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    throw error;
  }
};

/**
 * Crear nuevo inventario
 * POST /inventory/create
 */
export const createInventory = async (inventoryData) => {
  try {
    const response = await axios.post(
      `${API_URL}/create`,
      inventoryData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear inventario:', error);
    throw error;
  }
};

export const getAllInventories = async () => {
  try {
    const response = await axios.get(`${API_URL}/findAll`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los inventarios:', error);
    throw error;
  }
};

export const updateInventory = async (inventoryId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${inventoryId}`,
      updatedData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar inventario:', error);
    throw error;
  }
};

export const deleteInventory = async (inventoryId) => {
  try {
    const response = await axios.delete(`${API_URL}/${inventoryId}`, {
      headers: getAuthHeaders()
    });
    console.log('Inventario eliminado correctamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar inventario:', error);
    throw error;
  }
};