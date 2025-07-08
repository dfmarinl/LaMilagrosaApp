import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Search, Filter, Calculator, CreditCard } from 'lucide-react';
import { getAllProducts } from '../../api/product';
import {
  registerCustomerOrder,
  getAllCustomerOrders,
  aproveCustomerOrder,
  cancelCustomerOrder
} from '../../api/customer';
import { Product } from '../../types';

interface SaleItem {
  product: Product;
  quantity: number;
}

const SalesModule: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const categories = ['all', 'Jamones', 'Embutidos', 'Quesos', 'Conservas', 'Vinos', 'Aceites'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        const adaptedProducts: Product[] = data.map((item: any) => ({
          id: String(item.code),
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image || 'https://via.placeholder.com/100',
          category: 'Otros',
          stock: 50,
          isActive: true,
        }));
        setProducts(adaptedProducts);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await getAllCustomerOrders();
        setOrders(data);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
      }
    };

    fetchProducts();
    fetchOrders();
  }, []);

  const refreshOrders = async () => {
    try {
      const data = await getAllCustomerOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error al actualizar órdenes:', error);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.isActive && product.stock > 0;
  });

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return currentCart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return currentCart;
      }
      return [...currentCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.product.id === productId ? { ...item, quantity: Math.min(quantity, item.product.stock) } : item
      )
    );
  };

  const removeFromCart = (productId: string) =>
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const orderData = {
      date: new Date().toISOString().split('T')[0],
      IVA: 19,
      expirationDate: '2025-12-31',
      productsDetails: cart.map(item => ({
        productCode: Number(item.product.id),
        quantity: item.quantity
      }))
    };

    try {
      setLoading(true);
      await registerCustomerOrder(orderData);
      alert('Orden registrada exitosamente');
      clearCart();
      await refreshOrders();
    } catch (error) {
      console.error('Error al registrar la orden:', error);
      alert('Error al registrar la orden');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderNumber: number) => {
    try {
      await aproveCustomerOrder(orderNumber);
      alert(`Orden ${orderNumber} aprobada`);
      await refreshOrders();
    } catch (error) {
      console.error('Error al aprobar la orden:', error);
      alert('Error al aprobar la orden');
    }
  };

  const handleCancelOrder = async (orderNumber: number) => {
    try {
      await cancelCustomerOrder(orderNumber);
      alert(`Orden ${orderNumber} cancelada`);
      await refreshOrders();
    } catch (error) {
      console.error('Error al cancelar la orden:', error);
      alert('Error al cancelar la orden');
    }
  };

  return (
    <div className="space-y-6">
      {/* Parte de ventas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
          <ShoppingCart className="h-7 w-7 text-red-600" />
          <span>Módulo de Ventas</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Todas las categorías' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.category}</p>
                      <p className="text-lg font-bold text-red-600">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito y Checkout */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Carrito ({cart.length})</span>
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
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
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded-full ml-2"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length === 0 && <p className="text-gray-500 text-center py-4">Carrito vacío</p>}
            </div>

            {cart.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-4 w-4 text-gray-600" />
                    <span>Descuento (%):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={e => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    />
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-red-600 border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={handleCompleteSale}
                    disabled={loading}
                    className={`flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{loading ? 'Procesando...' : 'Completar Orden'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de órdenes */}
      <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
        <h2 className="text-xl font-semibold mb-4">Historial de Órdenes</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Número</th>
                  <th className="px-4 py-2 border">Fecha</th>
                  <th className="px-4 py-2 border">IVA</th>
                  <th className="px-4 py-2 border">Estado</th>
                  <th className="px-4 py-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order.number || index} className="border-t">
                    <td className="px-4 py-2 border">{order.number}</td>
                    <td className="px-4 py-2 border">{order.date}</td>
                    <td className="px-4 py-2 border">{order.iva !== null ? `${order.iva}%` : '-'}</td>
                    <td className="px-4 py-2 border">{order.aproved ? 'Aprobada' : 'Pendiente'}</td>
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleApproveOrder(order.number)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleCancelOrder(order.number)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesModule;





