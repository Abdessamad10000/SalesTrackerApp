
import React from 'react';
import { Sale } from '../types';
import { ShoppingCartIcon } from './icons';

interface SalesListProps {
  sales: Sale[];
}

const SalesList: React.FC<SalesListProps> = ({ sales }) => {
  if (sales.length === 0) {
    return <div className="text-center p-6 text-gray-500 bg-white rounded-lg shadow">لا توجد مبيعات حتى الآن. قم بتسجيل عملية بيع جديدة.</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
         <h3 className="text-lg font-semibold text-gray-700 flex items-center">
          <ShoppingCartIcon className="w-5 h-5 me-2 text-green-500" />
          قائمة المبيعات
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم المنتج</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وقت البيع</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ربح الوحدة</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">إجمالي الربح</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.sort((a,b) => b.saleDate.getTime() - a.saleDate.getTime()).map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sale.saleDate.toLocaleDateString('ar-EG')} {sale.saleDate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.unitProfit.toFixed(2)} د.م</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold text-left">{sale.totalProfit.toFixed(2)} د.م</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;
