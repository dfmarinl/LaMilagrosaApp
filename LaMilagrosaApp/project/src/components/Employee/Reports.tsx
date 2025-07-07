import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, Download, DollarSign, Package, Users, ShoppingBag } from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const salesData = [
    { month: 'Enero', sales: 2100000, orders: 145 },
    { month: 'Febrero', sales: 1800000, orders: 132 },
    { month: 'Marzo', sales: 2400000, orders: 168 },
    { month: 'Abril', sales: 2200000, orders: 156 },
    { month: 'Mayo', sales: 2600000, orders: 185 },
    { month: 'Junio', sales: 2450000, orders: 172 },
  ];

  const topProducts = [
    { name: 'Jamón Serrano Premium', sales: 45, revenue: 2025000 },
    { name: 'Chorizo Español', sales: 38, revenue: 684000 },
    { name: 'Queso Manchego', sales: 32, revenue: 1024000 },
    { name: 'Salchichón Ibérico', sales: 28, revenue: 784000 },
    { name: 'Aceitunas Gourmet', sales: 25, revenue: 300000 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const currentMonthData = salesData[salesData.length - 1];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reportes y Análisis</h1>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="quarter">Este trimestre</option>
              <option value="year">Este año</option>
            </select>
            <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <Download className="h-5 w-5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-orange-100 text-sm">Nuevos Clientes</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-orange-100 text-sm">+22% vs mes anterior</p>
              </div>
              <Users className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Ventas por Mes</span>
            </h3>
            <div className="space-y-3">
              {salesData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">{formatPrice(data.sales)}</div>
                    <div className="text-xs text-gray-500">{data.orders} pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Productos Más Vendidos</span>
            </h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.sales} unidades</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{formatPrice(product.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;