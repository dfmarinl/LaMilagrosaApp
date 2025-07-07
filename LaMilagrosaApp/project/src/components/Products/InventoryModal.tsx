import React, { useState } from 'react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (inventoryData: {
    stock: number;
    batchNumber: number;
    expirationDate: string;
    productId: string | number;
  }) => void;
  productId: string | number;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, onSave, productId }) => {
  const [stock, setStock] = useState<number>(0);
  const [batchNumber, setBatchNumber] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      stock,
      batchNumber,
      expirationDate,
      productId,
    });
    // Limpiar y cerrar
    setStock(0);
    setBatchNumber(0);
    setExpirationDate('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Agregar Inventario</h2>
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
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
