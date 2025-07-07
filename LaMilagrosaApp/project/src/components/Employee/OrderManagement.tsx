import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Package, Filter, Search } from 'lucide-react';
import { mockOrders } from '../../data/mockData';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = orders.filter(order => {
    return selectedStatus === 'all' || order.status === selectedStatus;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'delivered':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'delivered':
        return 'Entregado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
          <div className="text-sm text-gray-600">
            Total: {filteredOrders.length} pedidos
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="approved">Aprobados</option>
              <option value="delivered">Entregados</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold text-gray-800">
                    Pedido #{order.id}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium text-gray-600">
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2 md:mt-0">
                  {order.createdAt.toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Productos</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{item.product.name}</div>
                          <div className="text-sm text-gray-600">
                            {item.quantity} x {formatPrice(item.product.price)}
                          </div>
                        </div>
                        <div className="font-semibold text-red-600">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Detalles del Pedido</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Dirección de entrega</div>
                      <div className="font-medium text-gray-800">{order.deliveryAddress}</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">Total del pedido</div>
                      <div className="text-xl font-bold text-red-600">{formatPrice(order.total)}</div>
                    </div>
                    {order.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(order.id, 'approved')}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'rejected')}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                    {order.status === 'approved' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Marcar como Entregado
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron pedidos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;