import React, { useState } from 'react';
import { AlertTriangle, Package, RefreshCw, Bell, Settings } from 'lucide-react';
import { mockProducts } from '../../data/mockData';

const StockAlerts: React.FC = () => {
  const [minStockThreshold, setMinStockThreshold] = useState(10);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState(5);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const lowStockProducts = mockProducts.filter(product => 
    product.stock <= minStockThreshold && product.stock > criticalStockThreshold
  );

  const criticalStockProducts = mockProducts.filter(product => 
    product.stock <= criticalStockThreshold
  );

  const outOfStockProducts = mockProducts.filter(product => 
    product.stock === 0
  );

  const handleRestock = (productId: string) => {
    console.log('Restock product:', productId);
    // Aquí iría la lógica para crear una orden de restock
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Bell className="h-7 w-7 text-red-600" />
            <span>Alertas de Inventario</span>
          </h1>
          <button className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Settings className="h-5 w-5" />
            <span>Configurar</span>
          </button>
        </div>

        {/* Configuration */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Alertas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Mínimo (Alerta Amarilla)
              </label>
              <input
                type="number"
                value={minStockThreshold}
                onChange={(e) => setMinStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Crítico (Alerta Roja)
              </label>
              <input
                type="number"
                value={criticalStockThreshold}
                onChange={(e) => setCriticalStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Productos Agotados</p>
                <p className="text-3xl font-bold text-red-700">{outOfStockProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Stock Crítico</p>
                <p className="text-3xl font-bold text-orange-700">{criticalStockProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Stock Bajo</p>
                <p className="text-3xl font-bold text-yellow-700">{lowStockProducts.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Critical Stock Products */}
        {criticalStockProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Productos con Stock Crítico</span>
            </h3>
            <div className="space-y-3">
              {criticalStockProducts.map((product) => (
                <div key={product.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-medium text-red-600">
                          Stock: {product.stock} unidades
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio</p>
                        <p className="font-semibold text-gray-800">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRestock(product.id)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reabastecer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Out of Stock Products */}
        {outOfStockProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Productos Agotados</span>
            </h3>
            <div className="space-y-3">
              {outOfStockProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg grayscale"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-medium text-red-600">AGOTADO</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio</p>
                        <p className="font-semibold text-gray-800">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRestock(product.id)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reabastecer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Stock Products */}
        {lowStockProducts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-yellow-700 mb-4 flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Productos con Stock Bajo</span>
            </h3>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-sm font-medium text-yellow-600">
                          Stock: {product.stock} unidades
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Precio</p>
                        <p className="font-semibold text-gray-800">{formatPrice(product.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRestock(product.id)}
                        className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reabastecer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {criticalStockProducts.length === 0 && outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <p className="text-green-600 text-lg font-medium">¡Excelente! Todos los productos tienen stock suficiente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAlerts;