
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sale } from '../types';
import { ChartBarIcon } from './icons';

interface ProfitChartProps {
  sales: Sale[];
}

const ProfitChart: React.FC<ProfitChartProps> = ({ sales }) => {
  const getDailyProfitsForLast7Days = (): { date: string; profit: number }[] => {
    const dailyData: { [key: string]: number } = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric' });
      dailyData[dateString] = 0;
    }

    sales.forEach(sale => {
      const saleDate = new Date(sale.saleDate);
      const diffDays = Math.floor((today.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        const dateString = saleDate.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric' });
        if (dailyData[dateString] !== undefined) {
          dailyData[dateString] += sale.totalProfit;
        }
      }
    });
    
    return Object.entries(dailyData)
      .map(([date, profit]) => ({ date, profit: parseFloat(profit.toFixed(2)) }))
      .reverse(); // To show oldest to newest
  };

  const chartData = getDailyProfitsForLast7Days();

  if (sales.length === 0) {
    return <div className="text-center p-6 text-gray-500 bg-white rounded-lg shadow">لا توجد بيانات مبيعات كافية لعرض الرسم البياني.</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow h-[400px]">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
        <ChartBarIcon className="w-5 h-5 me-2 text-purple-500" />
        الأرباح اليومية (آخر 7 أيام)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-30} textAnchor="end" height={50} />
          <YAxis 
            tickFormatter={(value) => `${value} د.م`} 
            label={{ value: 'الربح (د.م)', angle: -90, position: 'insideLeft', offset:-5, style: {textAnchor: 'middle', fill: '#6b7280'}}}
            />
          <Tooltip formatter={(value: number) => [`${value.toFixed(2)} د.م`, "الربح"]} />
          <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '10px'}} />
          <Bar dataKey="profit" name="الربح اليومي" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfitChart;
