
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface ProductFormProps {
  onSave: (product: Omit<Product, 'id'>) => void;
  onClose: () => void;
  initialData?: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSave, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCostPrice(initialData.costPrice.toString());
      setSellingPrice(initialData.sellingPrice.toString());
    } else {
      setName('');
      setCostPrice('');
      setSellingPrice('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cost = parseFloat(costPrice);
    const selling = parseFloat(sellingPrice);

    if (!name.trim()) {
      setError('اسم المنتج مطلوب.');
      return;
    }
    if (isNaN(cost) || cost < 0) {
      setError('سعر التكلفة يجب أن يكون رقمًا موجبًا.');
      return;
    }
    if (isNaN(selling) || selling < 0) {
      setError('سعر البيع يجب أن يكون رقمًا موجبًا.');
      return;
    }
    if (selling < cost) {
      setError('سعر البيع يجب أن يكون أعلى من أو يساوي سعر التكلفة.');
      return;
    }

    onSave({ name, costPrice: cost, sellingPrice: selling });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
        <input
          type="text"
          id="productName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">سعر التكلفة (د.م)</label>
        <input
          type="number"
          id="costPrice"
          value={costPrice}
          onChange={(e) => setCostPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">سعر البيع (د.م)</label>
        <input
          type="number"
          id="sellingPrice"
          value={sellingPrice}
          onChange={(e) => setSellingPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="flex justify-end space-x-3 space-x-reverse">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          إلغاء
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'تحديث المنتج' : 'إضافة منتج'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
