import React, { useState, useEffect } from 'react';
import { createInventory, updateInventory, getInventoryByInventoryId } from '../../api/inventory';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | number;
  onSave: (newInventory: any) => void;
  editingInventory?: any | null;
}

const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  productId,
  onSave,
  editingInventory
}) => {
  const [stock, setStock] = useState<number>(0);
  const [batchNumber, setBatchNumber] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [realProductId, setRealProductId] = useState<string | number>(productId);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInventoryForEdit = async () => {
      try {
        if (editingInventory && editingInventory.id) {
          console.log('Buscando inventario con ID:', editingInventory.id);
          const inventory = await getInventoryByInventoryId(editingInventory.id);

          if (inventory) {
            setStock(Number(inventory.stock) || 0);
            setBatchNumber(Number(inventory.batchNumber) || 0);
            setExpirationDate(inventory.expirationDate || '');
            setRealProductId(inventory.productId); // guardamos productId real
          }
        } else {
          setStock(0);
          setBatchNumber(0);
          setExpirationDate('');
          setRealProductId(productId);
        }
      } catch (error) {
        console.error('Error al obtener inventario para editar:', error);
      }
    };

    if (isOpen) {
      fetchInventoryForEdit();
    }
  }, [editingInventory, isOpen, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newInventory;

      const payload = {
        stock: Number(stock),
        batchNumber: Number(batchNumber),
        expirationDate: expirationDate,
        productId: realProductId
      };

      if (editingInventory) {
        console.log('Actualizando inventario ID:', editingInventory.id, 'con datos:', payload);
        newInventory = await updateInventory(editingInventory.id, payload);
        // Opcional: incluir productId en el objeto que envías a onSave
        newInventory = { ...newInventory, id: editingInventory.id, productId: realProductId };
      } else {
        console.log('Creando nuevo inventario con datos:', payload);
        newInventory = await createInventory(payload);
      }

      console.log('Inventario guardado:', newInventory);
      onSave(newInventory);
      onClose();
    } catch (error) {
      console.error('Error al guardar inventario:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        `Error ${error.response?.status || 'desconocido'} al guardar el inventario`;
      alert(`Hubo un error al guardar el inventario: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingInventory ? 'Editar Inventario' : 'Agregar Inventario'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Cantidad (stock)</label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Número de lote</label>
            <input
              type="number"
              min="0"
              value={batchNumber}
              onChange={(e) => setBatchNumber(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Fecha de vencimiento</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;






