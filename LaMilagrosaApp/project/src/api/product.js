import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/products';

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Cambiado aquí
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Obtener todos los productos
 * GET /products/findAll
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/findAll`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

/**
 * Registrar un producto nuevo
 * POST /products/register
 */
export const registerProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      productData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al registrar producto:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  console.log('productId que llega a updateProduct:', productId);
  try {
    const response = await axios.put(
      `http://localhost:8080/api/v1/products/update/${productId}`,
      productData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${productId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};
