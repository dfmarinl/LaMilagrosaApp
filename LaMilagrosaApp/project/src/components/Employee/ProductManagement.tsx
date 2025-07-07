import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, PackagePlus } from 'lucide-react';
import { getAllProducts, deleteProduct } from '../../api/product';
import { getInventoryByProductId, getAllInventories, deleteInventory } from '../../api/inventory';
import { Product } from '../../types';
import ProductModal from '../Products/ProductModal';
import InventoryModal from '../Products/InventoryModal';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventories, setInventories] = useState<Record<string | number, any>>({});
  const [allInventories, setAllInventories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [selectedProductCode, setSelectedProductCode] = useState<string | number | null>(null);
  const [editingInventory, setEditingInventory] = useState<any | null>(null);

  const categories = ['all', 'Jamones', 'Embutidos', 'Quesos', 'Conservas', 'Vinos', 'Aceites'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        const mappedProducts = data.map((p: any) => ({ ...p, id: p.code }));
        setProducts(mappedProducts);

        const inventoryData: Record<string | number, any> = {};
        for (const product of mappedProducts) {
          try {
            const inventory = await getInventoryByProductId(product.code);
            inventoryData[product.id] = inventory;
          } catch {
            inventoryData[product.id] = null;
          }
        }
        setInventories(inventoryData);

        const inventoriesList = await getAllInventories();
        setAllInventories(inventoriesList);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'all' || product.category === selectedCategory)
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string | number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteProduct(productId);
        const updatedProducts = await getAllProducts();
        setProducts(updatedProducts.map((p: any) => ({ ...p, id: p.code })));
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const handleDeleteInventory = async (inventoryId: number | string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este inventario?')) {
      try {
        await deleteInventory(inventoryId);
        const inventoriesList = await getAllInventories();
        setAllInventories(inventoriesList);
      } catch (error) {
        console.error('Error al eliminar inventario:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Productos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Buscador y filtro */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabla productos */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleEditProduct(product)} className="text-blue-600 hover:text-blue-900">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProductCode(product.code);
                        setEditingInventory(null);
                        setIsInventoryModalOpen(true);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <PackagePlus className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron productos.</p>
          </div>
        )}
      </div>

      {/* Todos los Inventarios */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Todos los Inventarios</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3">Imagen</th>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Batch Number</th>
                <th className="px-6 py-3">Expiración</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allInventories.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {inv.productImage ? (
                      <img src={inv.productImage} alt={inv.productName} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">Sin imagen</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{inv.productName}</td>
                  <td className="px-6 py-4">{inv.stock}</td>
                  <td className="px-6 py-4">{inv.batchNumber}</td>
                  <td className="px-6 py-4">{inv.expirationDate}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => {
                        setEditingInventory(inv);
                        setSelectedProductCode(inv.productId);
                        setIsInventoryModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInventory(inv.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ProductModal
        isOpen={isModalOpen}
        editingProduct={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={async () => {
          const updatedProducts = await getAllProducts();
          setProducts(updatedProducts.map((p: any) => ({ ...p, id: p.code })));
        }}
      />
      <InventoryModal
        isOpen={isInventoryModalOpen}
        editingInventory={editingInventory}
        productId={selectedProductCode || ''}
        onClose={() => {
          setIsInventoryModalOpen(false);
          setEditingInventory(null);
        }}
        onSave={(newInventory) => {
          setAllInventories((prev) =>
            prev.map((inv) => (inv.id === newInventory.id ? newInventory : inv))
          );
          if (newInventory.productId) {
            setInventories((prev) => ({
              ...prev,
              [newInventory.productId]: newInventory,
            }));
          }
        }}
      />
    </div>
  );
};

export default ProductManagement;













