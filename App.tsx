
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Product, Sale, ActiveTab } from './types';
import ProductForm from './components/ProductForm';
import SaleForm from './components/SaleForm';
import ProfitDashboard from './components/ProfitDashboard';
import ProductList from './components/ProductList';
import SalesList from './components/SalesList';
import ProfitChart from './components/ProfitChart';
import Modal from './components/Modal';
import { PlusIcon, ShoppingCartIcon, TagIcon, ChartBarIcon } from './components/icons';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('salesAppProducts');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const savedSales = localStorage.getItem('salesAppSales');
    if (savedSales) {
      return JSON.parse(savedSales).map((s: any) => ({ ...s, saleDate: new Date(s.saleDate) }));
    }
    return [];
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.PRODUCTS);

  useEffect(() => {
    localStorage.setItem('salesAppProducts', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('salesAppSales', JSON.stringify(sales));
  }, [sales]);

  const handleAddProduct = useCallback((productData: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...productData, id: crypto.randomUUID() }]);
    setIsProductModalOpen(false);
  }, []);

  const handleAddSale = useCallback((saleData: Omit<Sale, 'id' | 'saleDate' | 'totalProfit' | 'unitProfit' | 'productName'>) => {
    const product = products.find(p => p.id === saleData.productId);
    if (!product) return;

    const unitProfit = product.sellingPrice - product.costPrice;
    const totalProfit = unitProfit * saleData.quantity;

    const newSale: Sale = {
      ...saleData,
      id: crypto.randomUUID(),
      productName: product.name,
      saleDate: new Date(),
      unitProfit,
      totalProfit,
    };
    setSales(prev => [...prev, newSale]);
    setIsSaleModalOpen(false);
  }, [products]);

  const calculateProfitForPeriod = useCallback((periodSales: Sale[]) => {
    return periodSales.reduce((sum, sale) => sum + sale.totalProfit, 0);
  }, []);

  const dailyProfit = useMemo(() => {
    const today = new Date().toDateString();
    const dailySales = sales.filter(sale => new Date(sale.saleDate).toDateString() === today);
    return calculateProfitForPeriod(dailySales);
  }, [sales, calculateProfitForPeriod]);

  const weeklyProfit = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Adjust for week starting Monday or Sunday
    startOfWeek.setHours(0,0,0,0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    const weeklySales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= startOfWeek && saleDate <= endOfWeek;
    });
    return calculateProfitForPeriod(weeklySales);
  }, [sales, calculateProfitForPeriod]);

  const monthlyProfit = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlySales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    return calculateProfitForPeriod(monthlySales);
  }, [sales, calculateProfitForPeriod]);

  const totalNetProfit = useMemo(() => {
    return calculateProfitForPeriod(sales);
  }, [sales, calculateProfitForPeriod]);

  const TabButton: React.FC<{tab: ActiveTab; label: string; icon: React.ReactNode}> = ({tab, label, icon}) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center justify-center px-4 py-3 text-sm font-medium rounded-t-lg transition-colors
        ${activeTab === tab ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
      >
        {icon}
        <span className="ms-2">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-4 md:p-8 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700">متتبع أرباح المبيعات</h1>
        <p className="text-gray-600 mt-2">أدر مبيعاتك وتتبع أرباحك بكفاءة.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls and Dashboard Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">الإجراءات السريعة</h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="w-5 h-5 me-2" />
                إضافة منتج جديد
              </button>
              <button
                onClick={() => setIsSaleModalOpen(true)}
                className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={products.length === 0}
              >
                <ShoppingCartIcon className="w-5 h-5 me-2" />
                تسجيل عملية بيع
              </button>
              {products.length === 0 && <p className="text-xs text-yellow-600 text-center">يجب إضافة منتجات أولاً لتسجيل عملية بيع.</p>}
            </div>
          </div>
          <ProfitDashboard
            dailyProfit={dailyProfit}
            weeklyProfit={weeklyProfit}
            monthlyProfit={monthlyProfit}
            totalNetProfit={totalNetProfit}
          />
        </div>

        {/* Main Content Panel (Tabs) */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 rounded-t-lg">
            <nav className="flex border-b border-gray-200">
              <TabButton tab={ActiveTab.PRODUCTS} label="المنتجات" icon={<TagIcon className="w-5 h-5"/>} />
              <TabButton tab={ActiveTab.SALES} label="المبيعات" icon={<ShoppingCartIcon className="w-5 h-5"/>} />
              <TabButton tab={ActiveTab.CHART} label="الرسم البياني" icon={<ChartBarIcon className="w-5 h-5"/>} />
            </nav>
          </div>
          <div className="mt-0"> {/* Removed negative margin */}
            {activeTab === ActiveTab.PRODUCTS && <ProductList products={products} />}
            {activeTab === ActiveTab.SALES && <SalesList sales={sales} />}
            {activeTab === ActiveTab.CHART && <ProfitChart sales={sales} />}
          </div>
        </div>
      </div>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="إضافة / تعديل منتج">
        <ProductForm onSave={handleAddProduct} onClose={() => setIsProductModalOpen(false)} />
      </Modal>

      <Modal isOpen={isSaleModalOpen} onClose={() => setIsSaleModalOpen(false)} title="تسجيل عملية بيع جديدة">
        <SaleForm products={products} onSave={handleAddSale} onClose={() => setIsSaleModalOpen(false)} />
      </Modal>
       <footer className="text-center mt-12 py-6 border-t border-gray-300">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} متتبع أرباح المبيعات. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default App;
