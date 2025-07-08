import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import ModalProveedor from '../Products/ModalProveedor';
import { getAllProviders, createProvider, updateProvider, deleteProvider } from '../../api/providers';

const SupplierManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getAllProviders();
      setSuppliers(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDeleteSupplier = async (supplierId: string | number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await deleteProvider(supplierId);
        setSuppliers(prev => prev.filter(s => s.id !== supplierId));
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        alert('Error al eliminar proveedor');
      }
    }
  };

  const handleSaveSupplier = async (supplierData: any) => {
    try {
      if (editingSupplier) {
        // Editar proveedor
        const updated = await updateProvider(editingSupplier.id, supplierData);
        setSuppliers(prev =>
          prev.map(s => (s.id === editingSupplier.id ? updated : s))
        );
      } else {
        // Crear nuevo proveedor
        const newSupplier = await createProvider(supplierData);
        setSuppliers(prev => [...prev, newSupplier]);
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      alert('Error al guardar proveedor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <button
            onClick={handleAddSupplier}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Agregar Proveedor</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{supplier.name}</td>
                  <td className="px-6 py-4">{supplier.email}</td>
                  <td className="px-6 py-4">{supplier.phone}</td>
                  <td className="px-6 py-4">{supplier.address}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEditSupplier(supplier)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSupplier(supplier.id)}
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

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron proveedores.</p>
          </div>
        )}
      </div>

      {/* ModalProveedor */}
      <ModalProveedor
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSupplier(null);
        }}
        onSave={handleSaveSupplier}
        editingSupplier={editingSupplier}
      />
    </div>
  );
};

export default SupplierManagement;

