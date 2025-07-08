
import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  Calendar,
  BarChart3,
  FileDown,
  X
} from 'lucide-react';
import { getSalesReport, getPurchasesReport, getSummaryReport } from '../../api/reports'; // Ajusta ruta

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para KPIs dinámicos
  const [summary, setSummary] = useState<{
    montoVentas: number;
    montoCompras: number;
    totalVentas: number;
    totalCompras: number;
  }>({
    montoVentas: 0,
    montoCompras: 0,
    totalVentas: 0,
    totalCompras: 0,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const openPdfInModal = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setIsModalOpen(true);
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona rango de fechas');
      return;
    }
    try {
      console.log('CLICK detectado, llamando getSummaryReport con fechas:', startDate, endDate);
      const data = await getSummaryReport(startDate, endDate);
      console.log('Resumen recibido:', data);
      setSummary(data);
    } catch (error) {
      console.error('Error al obtener resumen:', error);
      alert('Error al obtener resumen');
    }
  };

  const handleDownloadSalesReport = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona rango de fechas');
      return;
    }
    try {
      const data = await getSalesReport(startDate, endDate);
      openPdfInModal(new Blob([data], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Error al descargar reporte de ventas:', error);
      alert('Error al descargar reporte de ventas');
    }
  };

  const handleDownloadPurchasesReport = async () => {
    if (!startDate || !endDate) {
      alert('Selecciona rango de fechas');
      return;
    }
    try {
      const data = await getPurchasesReport(startDate, endDate);
      openPdfInModal(new Blob([data], { type: 'application/pdf' }));
    } catch (error) {
      console.error('Error al descargar reporte de compras:', error);
      alert('Error al descargar reporte de compras');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h1>
        </div>

        {/* 📅 Formulario fechas */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 text-sm">Fecha inicio:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-gray-700 text-sm">Fecha fin:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Generar Reporte</span>
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Monto Ventas</p>
                <p className="text-2xl font-bold">{formatPrice(summary.montoVentas)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Ventas</p>
                <p className="text-2xl font-bold">{summary.totalVentas}</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Monto Compras</p>
                <p className="text-2xl font-bold">{formatPrice(summary.montoCompras)}</p>
              </div>
              <Package className="h-12 w-12 text-purple-200" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Compras</p>
                <p className="text-2xl font-bold">{summary.totalCompras}</p>
              </div>
              <Users className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Tabla PDF */}
        <div className="mt-6">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Reporte</th>
                <th className="px-4 py-2 border">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 border">Órdenes de Venta</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={handleDownloadSalesReport}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Ver PDF</span>
                  </button>
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 border">Órdenes de Compra</td>
                <td className="px-4 py-2 border">
                  <button
                    onClick={handleDownloadPurchasesReport}
                    className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Ver PDF</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal PDF */}
      {isModalOpen && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg overflow-hidden w-full max-w-4xl h-[80%]">
            <button
              onClick={() => {
                setIsModalOpen(false);
                URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
              }}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-6 w-6" />
            </button>
            <iframe src={pdfUrl} title="Reporte PDF" className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
