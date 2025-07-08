import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/reportes';

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

/**
 * Obtener reporte de ventas por rango de fechas
 * GET /reportes/ventas?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getSalesReport = async (from, to) => {
  try {
    const response = await axios.get(`${API_URL}/ventas?from=${from}&to=${to}`, {
      headers: getAuthHeaders(),
      responseType: 'blob', // Para recibir PDF
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte de ventas:', error);
    throw error;
  }
};

/**
 * Obtener reporte de compras por rango de fechas
 * GET /reportes/compras?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getPurchasesReport = async (from, to) => {
  try {
    const response = await axios.get(`${API_URL}/compras?from=${from}&to=${to}`, {
      headers: getAuthHeaders(),
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte de compras:', error);
    throw error;
  }
};

/**
 * Obtener reporte resumen por rango de fechas
 * GET /reportes/resumen?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export const getSummaryReport = async (from, to) => {
  try {
    const response = await axios.get(`${API_URL}/resumen?from=${from}&to=${to}`, {
      headers: getAuthHeaders(),
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener reporte resumen:', error);
    throw error;
  }
};
