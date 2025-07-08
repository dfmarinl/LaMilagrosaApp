import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/order/customer';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Registrar una orden de compra con IVA fijo en 19
 */
export const registerCustomerOrder = async (orderData) => {
  try {
    const email = localStorage.getItem('userEmail');
    if (!email) {
      throw new Error('No hay email guardado del usuario logueado');
    }

    // Clonamos el orderData y forzamos el IVA a 19
    const fixedOrderData = {
      ...orderData,
      iva: 19
    };

    const response = await axios.post(
      `${API_URL}/register/${email}`,
      fixedOrderData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al registrar orden de compra:', error);
    throw error;
  }
};


export const getAllCustomerOrders = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/findAllOrders`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener las órdenes del cliente:', error);
    throw error;
  }
};

export async function aproveCustomerOrder(orderNumber) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_URL}/aproveOrder/${orderNumber}`,
      {}, // cuerpo vacío
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al aprobar la orden:', error);
    throw error;
  }
}

export async function cancelCustomerOrder(orderNumber) {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${API_URL}/${orderNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al cancelar la orden:', error);
    throw error;
  }
}