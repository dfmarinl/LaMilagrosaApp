import React, { useState } from 'react';
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  Calendar,
  BarChart3
} from 'lucide-react';

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const salesData = [
    { month: 'Enero', sales: 2100000, orders: 145 },
    { month: 'Febrero', sales: 1800000, orders: 132 },
    { month: 'Marzo', sales: 2400000, orders: 168 },
    { month: 'Abril', sales: 2200000, orders: 156 },
    { month: 'Mayo', sales: 2600000, orders: 185 },
    { month: 'Junio', sales: 2450000, orders: 172 },
  ];

  const handleGenerateReport = () => {
    console.log('Generar reporte desde:', startDate, 'hasta:', endDate);
    // Aquí iría la lógica real para generar el reporte
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const currentMonthData = salesData[salesData.length - 1];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h1>
        </div>

        {/* 📅 Formulario de rango de fechas */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ventas del Mes</p>
                <p className="text-2xl font-bold">{formatPrice(currentMonthData.sales)}</p>
                <p className="text-green-100 text-sm">+12% vs mes anterior</p>
              </div>
              <DollarSign className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Órdenes</p>
                <p className="text-2xl font-bold">{currentMonthData.orders}</p>
                <p className="text-blue-100 text-sm">+8% vs mes anterior</p>
              </div>
              <ShoppingBag className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Productos Vendidos</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-purple-100 text-sm">+15% vs mes anterior</p>
              </div>
              <Package className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Empleados</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-orange-100 text-sm">+22% vs mes anterior</p>
              </div>
              <Users className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;

