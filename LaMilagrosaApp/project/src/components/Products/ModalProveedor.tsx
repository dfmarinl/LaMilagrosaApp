import React, { useState, useEffect } from 'react';

interface Supplier {
  id?: number | string;
  name: string;
  phone: number;
  address: string;
  email: string;
}

interface ModalProveedorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Supplier) => void;
  editingSupplier?: Supplier | null;
}

const ModalProveedor: React.FC<ModalProveedorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSupplier,
}) => {
  const [formData, setFormData] = useState<Supplier>({
    name: '',
    phone: 0,
    address: '',
    email: '',
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData(editingSupplier);
    } else {
      setFormData({
        name: '',
        phone: 0,
        address: '',
        email: '',
      });
    }
  }, [editingSupplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'phone' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {editingSupplier ? 'Editar Proveedor' : 'Registrar Proveedor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            name="phone"
            type="number"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Número de teléfono 7"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Dirección"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Correo electrónico"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalProveedor;

