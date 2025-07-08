import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/categories';

// Función para obtener el token JWT desde localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Obtener todas las categorías
 * GET /categories
 */
export const getAllCategories = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Obtener una categoría por ID
 * GET /categories/{id}
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Crear una nueva categoría
 * POST /categories
 */
export const createCategory = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la categoría:', error);
    throw error;
  }
};

/**
 * Actualizar una categoría existente
 * PUT /categories/{id}
 */
export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la categoría con ID ${id}:`, error);
    throw error;
  }
};

/**
 * Eliminar una categoría
 * DELETE /categories/{id}
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la categoría con ID ${id}:`, error);
    throw error;
  }
};
