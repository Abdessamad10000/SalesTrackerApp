
import React, { useState } from 'react';
import { Product, Sale } from '../types';

interface SaleFormProps {
  products: Product[];
  onSave: (sale: Omit<Sale, 'id' | 'saleDate' | 'totalProfit' | 'unitProfit' | 'productName'>) => void;
  onClose: () => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ products, onSave, onClose }) => {
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!productId) {
      setError('يرجى اختيار منتج.');
      return;
    }
    
    const numQuantity = parseInt(quantity, 10);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('الكمية يجب أن تكون رقمًا صحيحًا موجبًا.');
      return;
    }

    onSave({ productId, quantity: numQuantity });
  };

  if (products.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">يرجى إضافة منتجات أولاً قبل تسجيل عملية بيع.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          إغلاق
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">اختر المنتج</label>
        <select
          id="product"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="" disabled>-- اختر منتجًا --</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (السعر: {product.sellingPrice.toFixed(2)} د.م)
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          min="1"
          step="1"
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
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          تسجيل البيع
        </button>
      </div>
    </form>
  );
};

export default SaleForm;
