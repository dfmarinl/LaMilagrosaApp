import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, RefreshCw, Bell, Settings, Clock } from 'lucide-react';
import { getAllInventories } from '../../api/inventory';

interface InventoryItem {
  id: number;
  stock: number;
  batchNumber: number;
  expirationDate: string;
  productName: string;
  productImage: string;
  productId: number;
}

const StockAlerts: React.FC = () => {
  const [inventories, setInventories] = useState<InventoryItem[]>([]);
  const [minStockThreshold, setMinStockThreshold] = useState(10);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventories = async () => {
      try {
        const data = await getAllInventories();
        setInventories(data);
      } catch (error) {
        console.error('Error cargando inventarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const expiredProducts = inventories.filter(item => new Date(item.expirationDate) < today);
  const nearExpirationProducts = inventories.filter(item =>
    new Date(item.expirationDate) >= today && new Date(item.expirationDate) <= next7Days
  );
  const outOfStockProducts = inventories.filter(item => item.stock === 0);
  const criticalStockProducts = inventories.filter(item =>
    item.stock > 0 && item.stock <= criticalStockThreshold
  );
  const lowStockProducts = inventories.filter(item =>
    item.stock > criticalStockThreshold && item.stock <= minStockThreshold
  );

  const handleRestock = (id: number) => {
    console.log('Reabastecer inventario ID:', id);
  };

  if (loading) {
    return <p className="text-center text-gray-600">Cargando inventarios...</p>;
  }

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

        {/* Configuración */}
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

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <SummaryCard title="Agotados" count={outOfStockProducts.length} color="red" icon={Package} />
          <SummaryCard title="Crítico" count={criticalStockProducts.length} color="orange" icon={AlertTriangle} />
          <SummaryCard title="Bajo" count={lowStockProducts.length} color="yellow" icon={Package} />
          <SummaryCard title="Vencidos" count={expiredProducts.length} color="red" icon={Clock} />
          <SummaryCard title="Pronto a vencer" count={nearExpirationProducts.length} color="orange" icon={Clock} />
        </div>

        {/* Listas detalladas */}
        {[
          { title: 'Productos Vencidos', items: expiredProducts, color: 'red' },
          { title: 'Pronto a vencer (≤7 días)', items: nearExpirationProducts, color: 'orange' },
          { title: 'Stock Crítico', items: criticalStockProducts, color: 'orange' },
          { title: 'Stock Bajo', items: lowStockProducts, color: 'yellow' },
          { title: 'Agotados', items: outOfStockProducts, color: 'gray' },
        ].map(({ title, items, color }) =>
          items.length > 0 && (
            <div key={title} className="mb-8">
              <h3 className={`text-lg font-semibold text-${color}-700 mb-4 flex items-center space-x-2`}>
                <span>{title}</span>
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">No Img</div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.productName}</h4>
                          <p className="text-sm text-gray-600">Lote: {item.batchNumber}</p>
                          <p className="text-sm text-gray-600">Vence: {formatDate(item.expirationDate)}</p>
                          <p className={`text-sm font-medium text-${color}-600`}>Stock: {item.stock}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRestock(item.id)}
                        className={`flex items-center space-x-2 bg-${color}-600 text-white px-3 py-2 rounded-lg hover:bg-${color}-700 transition-colors`}
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reabastecer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Si no hay alertas */}
        {expiredProducts.length === 0 &&
          nearExpirationProducts.length === 0 &&
          criticalStockProducts.length === 0 &&
          lowStockProducts.length === 0 &&
          outOfStockProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <p className="text-green-600 text-lg font-medium">¡Todo está en orden! Sin alertas de inventario</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default StockAlerts;

interface SummaryCardProps {
  title: string;
  count: number;
  color: string;
  icon: React.ElementType;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, color, icon: Icon }) => (
  <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4 flex flex-col items-center`}>
    <Icon className={`h-6 w-6 text-${color}-600 mb-2`} />
    <p className={`text-${color}-600 text-sm font-medium`}>{title}</p>
    <p className={`text-2xl font-bold text-${color}-700`}>{count}</p>
  </div>
);

