import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Truck, Calendar, Package } from 'lucide-react';
import { mockSupplierOrders, mockProducts } from '../../data/mockData';

const SupplierManagement: React.FC = () => {
  const [supplierOrders, setSupplierOrders] = useState(mockSupplierOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = supplierOrders.filter(order => {
    const product = mockProducts.find(p => p.id === order.productId);
    return product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'ordered':
        return 'Ordenado';
      case 'received':
        return 'Recibido';
      default:
        return 'Desconocido';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setSupplierOrders(supplierOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus as any } : order
    ));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <button className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Nueva Orden</span>
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por producto o proveedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Supplier Orders */}
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const product = mockProducts.find(p => p.id === order.productId);
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{order.supplierName}</h3>
                      <p className="text-sm text-gray-600">Orden #{order.id}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Detalles del Producto</h4>
                    {product && (
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h5 className="font-medium text-gray-800">{product.name}</h5>
                          <p className="text-sm text-gray-600">Categoría: {product.category}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {order.quantity} unidades
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Información de la Orden</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Precio unitario</div>
                        <div className="font-medium text-gray-800">{formatPrice(order.unitPrice)}</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatPrice(order.unitPrice * order.quantity)}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Entrega esperada</span>
                        </div>
                        <div className="font-medium text-gray-800">
                          {order.expectedDelivery.toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleStatusChange(order.id, 'ordered')}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Confirmar Orden
                        </button>
                      </div>
                    )}

                    {order.status === 'ordered' && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleStatusChange(order.id, 'received')}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Marcar como Recibido
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron órdenes de proveedores.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierManagement;