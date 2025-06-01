
import React from 'react';
import { Product } from '../types';
import { TagIcon } from './icons';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (products.length === 0) {
    return <div className="text-center p-6 text-gray-500 bg-white rounded-lg shadow">لا توجد منتجات حتى الآن. قم بإضافة منتج جديد.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <TagIcon className="w-5 h-5 me-2 text-indigo-500" />
          قائمة المنتجات
        </h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-800">{product.name}</span>
              <div className="text-sm text-gray-600 text-left">
                <p>التكلفة: {product.costPrice.toFixed(2)} د.م</p>
                <p>البيع: <span className="font-semibold text-green-600">{product.sellingPrice.toFixed(2)} د.م</span></p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
