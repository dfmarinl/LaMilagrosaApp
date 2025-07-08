import React, { useCallback, useEffect, useState } from 'react';
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  Filter,
  Calculator,
  CreditCard
} from 'lucide-react';
import { getAllProducts } from '../../api/product';
import {
  getAllPurchaseOrders,
  createPurchaseOrder,
  approvePurchaseOrder,
  deletePurchaseOrder
} from '../../api/purchase';
import { getAllProviders } from '../../api/providers';
import { Product, Provider } from '../../types';

interface PurchaseItem {
  product: Product;
  quantity: number;
}

const OrderManagement: React.FC = () => {
  
   const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<PurchaseItem[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, orderData, providerData] = await Promise.all([
          getAllProducts(),
          getAllPurchaseOrders(),
          getAllProviders()
        ]);

        // Asegurarse de que los productos tengan IDs únicos
        const adaptedProducts = productData.map((product: any) => ({
          ...product,
          id: String(product.id || product.code), // Usar code como fallback
          category: product.category?.name || 'Sin categoría'
        }));

        setProducts(adaptedProducts);
        setOrders(orderData);
        setProviders(providerData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, []);

  const refreshOrders = async () => {
    try {
      const data = await getAllPurchaseOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error al actualizar órdenes:', err);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const addToCart = useCallback((product: Product) => {
    console.log('Adding product:', product.id, product.name); // Debug
    
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        // Si existe, incrementar la cantidad
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1
        };
        console.log('Updated cart:', newCart); // Debug
        return newCart;
      }
      
      // Si no existe, agregar nuevo item
      const newCart = [...prevCart, { product, quantity: 1 }];
      console.log('New cart:', newCart); // Debug
      return newCart;
    });
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };
  

   const removeFromCart = (productId: string) =>
    setCart(prev => prev.filter(item => item.product.id !== productId));

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    if (!selectedProvider) {
      alert('Seleccione un proveedor.');
      return;
    }
    if (cart.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    const order = {
      providerId: Number(selectedProvider),
      date: new Date().toISOString().split('T')[0],
      iva: 19,
      expirationDate: '2025-12-31',
      productsDetails: cart.map(item => ({
        productCode: Number(item.product.id),
        quantity: item.quantity
      }))
    };


    try {
      setLoading(true);
      const email = localStorage.getItem('userEmail');
      await createPurchaseOrder(email, order);
      alert('Orden de compra registrada');
      clearCart();
      await refreshOrders();
    } catch (err) {
      console.error('Error al registrar orden:', err);
      alert('No se pudo registrar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderNumber: number) => {
    try {
      await approvePurchaseOrder(orderNumber);
      alert('Orden aprobada');
      await refreshOrders();
    } catch (err) {
      console.error('Error al aprobar:', err);
    }
  };

  const handleDelete = async (orderNumber: number) => {
    try {
      await deletePurchaseOrder(orderNumber);
      alert('Orden eliminada');
      await refreshOrders();
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  return (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 flex items-center space-x-2">
        <ShoppingCart className="h-6 w-6 text-red-600" />
        <span>Gestión de Órdenes de Compra</span>
      </h1>

      {/* Filtros y proveedor */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            placeholder="Buscar productos"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative col-span-2">
          <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <select
            value={selectedProvider}
            onChange={e => setSelectedProvider(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg w-full bg-white"
          >
            <option value="">Seleccionar proveedor</option>
            {providers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenedor principal de productos y carrito */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Lista de productos - ahora ocupa 2/3 del espacio */}
        <div className="md:w-2/3">
          <h2 className="text-lg font-semibold mb-3">Productos Disponibles</h2>
          <div className="grid grid-cols-1 gap-4 max-h-[calc(100vh-300px)] overflow-y-auto p-1">
            {filteredProducts.map(product => (
              <div key={product.id} className="border rounded-lg p-4 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category?.name || 'Sin categoría'}</p>
                  <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
                </div>
                <button 
                  onClick={() => addToCart(product)} 
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                  aria-label={`Agregar ${product.name} al carrito`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito - ahora ocupa 1/3 del espacio y está al lado */}
        <div className="md:w-1/3 bg-gray-50 p-4 rounded-lg sticky top-4 h-fit">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Carrito ({cart.length})</span>
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">El carrito está vacío</p>
            ) : (
              cart.map(item => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-red-600 font-semibold">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)} 
                      className="p-1 hover:bg-gray-200 rounded-full"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)} 
                      className="p-1 hover:bg-gray-200 rounded-full"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.product.id)} 
                      className="p-1 hover:bg-red-100 text-red-600 rounded-full ml-2"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="flex justify-between font-bold text-red-600 text-lg">
                <span>Total:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={clearCart} 
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleCreateOrder}
                  disabled={loading}
                  className={`flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <CreditCard className="h-4 w-4 inline mr-1" />
                  {loading ? 'Procesando...' : 'Registrar Orden'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Tabla de órdenes (se mantiene igual) */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Órdenes de Compra Registradas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Número</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Proveedor</th>
              <th className="px-4 py-2 border">IVA</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.number} className="border-t">
                <td className="px-4 py-2 border">{order.number}</td>
                <td className="px-4 py-2 border">{order.date}</td>
                <td className="px-4 py-2 border">{order.providerId || '-'}</td>
                <td className="px-4 py-2 border">{order.iva}%</td>
                <td className="px-4 py-2 border">
                  {order.aproved ? (
                    <span className="text-green-600">Aprobada</span>
                  ) : (
                    <span className="text-yellow-600">Pendiente</span>
                  )}
                </td>
                <td className="px-4 py-2 border space-x-2">
                  {!order.aproved && (
                    <button
                      onClick={() => handleApprove(order.number)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                    >
                      Aprobar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(order.number)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
};

export default OrderManagement;
