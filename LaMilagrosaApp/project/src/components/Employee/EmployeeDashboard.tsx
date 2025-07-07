import React from 'react';
import { BarChart3, Users, Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import ProductManagement from './ProductManagement';
import SalesModule from './SalesModule';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement';
import OrderManagement from './OrderManagement';
import SupplierManagement from './SupplierManagement';
import StockAlerts from './StockAlerts';
import Reports from './Reports';

interface EmployeeDashboardProps {
  activeSection: string;
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ activeSection }) => {
  if (activeSection === 'productos') {
    return <ProductManagement />;
  }

  if (activeSection === 'categorias') {
    return <CategoryManagement />;
  }
  if (activeSection === 'ventas') {
    return <SalesModule />;
  }

  if (activeSection === 'usuarios') {
    return <UserManagement />;
  }

  if (activeSection === 'pedidos') {
    return <OrderManagement />;
  }

  if (activeSection === 'proveedores') {
    return <SupplierManagement />;
  }

  if (activeSection === 'alertas-stock') {
    return <StockAlerts />;
  }

  if (activeSection === 'reportes') {
    return <Reports />;
  }

  // Dashboard overview
  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$2,450,000',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12%',
    },
    {
      title: 'Pedidos Pendientes',
      value: '23',
      icon: ShoppingBag,
      color: 'bg-yellow-500',
      trend: '+5%',
    },
    {
      title: 'Productos Activos',
      value: '156',
      icon: Package,
      color: 'bg-blue-500',
      trend: '+8%',
    },
    {
      title: 'Usuarios Registrados',
      value: '1,247',
      icon: Users,
      color: 'bg-purple-500',
      trend: '+15%',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Productos Más Vendidos</h3>
          <div className="space-y-3">
            {[
              { name: 'Jamón Serrano Premium', sales: 45 },
              { name: 'Chorizo Español', sales: 38 },
              { name: 'Queso Manchego', sales: 32 },
              { name: 'Salchichón Ibérico', sales: 28 },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">{product.name}</span>
                <span className="text-red-600 font-semibold">{product.sales} ventas</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {[
              { action: 'Nuevo pedido recibido', time: 'Hace 5 minutos' },
              { action: 'Producto actualizado', time: 'Hace 1 hora' },
              { action: 'Usuario registrado', time: 'Hace 2 horas' },
              { action: 'Pedido entregado', time: 'Hace 3 horas' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-800">{activity.action}</span>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;