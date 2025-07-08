import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/order/purchase';

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Obtener todas las órdenes de compra
 * GET /order/purchase/findAllOrders
 */
export const getAllPurchaseOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/findAllOrders`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener órdenes de compra:', error);
    throw error;
  }
};

/**
 * Obtener una orden de compra por ID
 * GET /order/purchase/{id}
 */
export const getPurchaseOrderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la orden con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crear una orden de compra
 * POST /order/purchase/register/{email}
 */
export const createPurchaseOrder = async (email, orderData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register/${email}`,
      orderData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al crear la orden de compra:', error);
    throw error;
  }
};

/**
 * Actualizar una orden de compra
 * PUT /order/purchase/update/{id}
 */
export const updatePurchaseOrder = async (id, orderData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${id}`,
      orderData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la orden con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar una orden de compra
 * DELETE /order/purchase/{id}
 */
export const deletePurchaseOrder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la orden con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Aprobar una orden de compra
 * POST /order/purchase/aproveOrder/{id}
 */
export const approvePurchaseOrder = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/aproveOrder/${id}`,
      {}, // el body va vacío
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error(`Error al aprobar la orden con ID ${id}:`, error);
    throw error;
  }
};
