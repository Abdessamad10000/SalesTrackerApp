
import React from 'react';
import { CalendarDaysIcon } from './icons'; // Assuming a generic icon for profit

interface ProfitDashboardProps {
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  totalNetProfit: number;
}

const ProfitCard: React.FC<{ title: string; amount: number; bgColorClass: string; textColorClass: string }> = ({ title, amount, bgColorClass, textColorClass }) => (
  <div className={`${bgColorClass} p-6 rounded-xl shadow-lg flex flex-col items-center justify-center`}>
    <h3 className={`text-lg font-semibold ${textColorClass} mb-2`}>{title}</h3>
    <p className={`text-3xl font-bold ${textColorClass}`}>{amount.toFixed(2)} <span className="text-sm">د.م</span></p>
  </div>
);

const ProfitDashboard: React.FC<ProfitDashboardProps> = ({ dailyProfit, weeklyProfit, monthlyProfit, totalNetProfit }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center">
        <CalendarDaysIcon className="w-8 h-8 me-2 text-indigo-600" />
        ملخص الأرباح
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfitCard title="الربح اليومي" amount={dailyProfit} bgColorClass="bg-green-100" textColorClass="text-green-700" />
        <ProfitCard title="الربح الأسبوعي" amount={weeklyProfit} bgColorClass="bg-blue-100" textColorClass="text-blue-700" />
        <ProfitCard title="الربح الشهري" amount={monthlyProfit} bgColorClass="bg-yellow-100" textColorClass="text-yellow-700" />
        <ProfitCard title="صافي الربح الإجمالي" amount={totalNetProfit} bgColorClass="bg-purple-100" textColorClass="text-purple-700" />
      </div>
    </div>
  );
};

export default ProfitDashboard;
