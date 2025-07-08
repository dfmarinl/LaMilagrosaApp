import React, { useState, useEffect } from 'react';
import { registerProduct, updateProduct } from '../../api/product';
import { getAllCategories } from '../../api/category';
import { uploadProductImage } from '../../api/productImg';
import { Product } from '../../types';

type Props = {
  isOpen: boolean;
  editingProduct: Product | null;
  onClose: () => void;
  onSave: () => Promise<void>;
};

const ProductModal: React.FC<Props> = ({ isOpen, editingProduct, onClose, onSave }) => {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    categoryId: number | '';
    price: number;
    stock: number;
    image: string;
  }>({
    name: '',
    description: '',
    categoryId: '',
    price: 0,
    stock: 0,
    image: '',
  });
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        categoryId: editingProduct.category?.id || '',
        price: editingProduct.price,
        stock: editingProduct.stock,
        image: editingProduct.image,
      });
    } else {
      setForm({
        name: '',
        description: '',
        categoryId: '',
        price: 0,
        stock: 0,
        image: '',
      });
    }
  }, [editingProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'categoryId' ? Number(value) : value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadProductImage(file);
        setForm(prev => ({ ...prev, image: url }));
      } catch (error) {
        console.error('Error al subir imagen:', error);
        alert('Error al subir imagen. Intenta de nuevo.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        image: form.image,
        categoryId: form.categoryId,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.code!, productData);
      } else {
        await registerProduct(productData);
      }
      await onSave();
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto. Revisa la consola.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">
          {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="description"
            placeholder="Descripción"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="number"
            name="price"
            placeholder="Precio"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border px-3 py-2 rounded"
          />
          {uploading && <p className="text-sm text-gray-500">Subiendo imagen...</p>}
          {form.image && (
            <img src={form.image} alt="Vista previa" className="h-24 mt-2 rounded" />
          )}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              {editingProduct ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;



