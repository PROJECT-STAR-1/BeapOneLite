// components/CashFlowStatement.jsx

import { useState, useEffect } from 'react';
import { Download, ArrowDownUp, Info } from 'lucide-react';

export default function CashFlowStatement() {
  const [cashFlowData, setCashFlowData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    async function fetchCashFlowData() {
      try {
        const res = await fetch('/api/beapOnelite/financialreports');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        
        // Extract the cash flow specific data from the main payload
        if (json.cashFlowData) {
          setCashFlowData(json.cashFlowData);
        } else {
          setError("Cash Flow Statement data not found in the API response.");
        }
      } catch (err) {
        console.error("Failed to fetch Cash Flow Statement data:", err);
        setError("Failed to load financial data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCashFlowData();
  }, []);
  // -----------------------------


  // =============================================
  // Helper
  // =============================================
  const formatCurrency = (amount) => {
    const abs = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(abs);

    if (amount > 0) return <span className="text-green-600">+{formatted}</span>;
    if (amount < 0) return <span className="text-red-600">−{formatted}</span>;
    return <span className="text-gray-700">₦0</span>;
  };
  
  const handleExportPDF = () => {
    // Standard browser print function for PDF export
    window.print();
  };

  // --- Loading and Error States ---
  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading Cash Flow Statement...</div>;
  }
  
  if (error || !cashFlowData) {
    return <div className="p-6 text-center text-red-500">{error || "Cash Flow Statement data is not available."}</div>;
  }

  // --- Destructuring for cleaner JSX ---
  const { period, beginningCash, netChange, endingCash, operating, investing, financing } = cashFlowData;

  // --- Calculations (unchanged, using destructured data) ---
  // The mock data already has netCash pre-calculated, but for robustness:
  // const calculatedNetChange = operating.netCash + investing.netCash + financing.netCash;
  // const isDataConsistent = Math.abs(calculatedNetChange - netChange) < 0.01;
  // const calculatedEndingCash = beginningCash + netChange;
  
  
  return (
    <div className='mt-5 p-3'>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <ArrowDownUp className="w-7 h-7" />
            Cash Flow Statement
          </h2>
          <p className="text-gray-600">For the period {period}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
            netChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            Net Change: {formatCurrency(netChange)}
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium rounded-lg print:hidden"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Operating Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-blue-100 px-6 py-5">
          <h3 className="text-lg font-bold text-blue-900">Cash Flow from Operating Activities</h3>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-between">
            <span>Net Income</span>
            {formatCurrency(operating.netIncome)}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-4">Adjustments to reconcile net income to net cash:</p>
            <div className="space-y-3 ml-6">
              {operating.adjustments.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-700">{item.label}</span>
                  {formatCurrency(item.amount)}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t-2 border-blue-500 pt-4">
            <div className="flex justify-between text-lg font-bold text-blue-900">
              <span>Net Cash from Operating Activities</span>
              <span className={operating.netCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(operating.netCash)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investing Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-purple-100 px-6 py-5">
          <h3 className="text-lg font-bold text-purple-900">Cash Flow from Investing Activities</h3>
        </div>
        <div className="p-6 space-y-4">
          {investing.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-700">{item.label}</span>
              {formatCurrency(item.amount)}
            </div>
          ))}
          <div className="border-t-2 border-purple-500 pt-4">
            <div className="flex justify-between text-lg font-bold text-purple-900">
              <span>Net Cash from Investing Activities</span>
              <span className={investing.netCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(investing.netCash)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financing Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-green-100 px-6 py-5">
          <h3 className="text-lg font-bold text-green-900">Cash Flow from Financing Activities</h3>
        </div>
        <div className="p-6 space-y-4">
          {financing.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-700">{item.label}</span>
              {formatCurrency(item.amount)}
            </div>
          ))}
          <div className="border-t-2 border-green-500 pt-4">
            <div className="flex justify-between text-lg font-bold text-green-900">
              <span>Net Cash from Financing Activities</span>
              <span className="text-green-600">{formatCurrency(financing.netCash)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards + Final Totals */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <p className="text-sm text-gray-600">Operating Cash Flow</p>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(operating.netCash)}</p>
            <p className="text-xs text-gray-500">{((operating.netCash / netChange) * 100).toFixed(0)}% of total</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Investing Cash Flow</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(investing.netCash)}</p>
            <p className="text-xs text-gray-500">{((investing.netCash / netChange) * 100).toFixed(0)}% of total</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Financing Cash Flow</p>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(financing.netCash)}</p>
            <p className="text-xs text-gray-500">{((financing.netCash / netChange) * 100).toFixed(0)}% of total</p>
          </div>
        </div>
        

        <div className="border-t-4 border-blue-600 pt-8">
          <div className="flex justify-between text-xl font-bold text-blue-900 mb-4">
            <span>Net Change in Cash</span>
            <span className={netChange >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(netChange)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Cash at Beginning of Period</span>
            <span>{formatCurrency(beginningCash)}</span>
          </div>
          <div className="flex justify-between text-3xl font-bold text-blue-900 mt-6 pt-6 border-t-4 border-blue-700">
            <span>Cash at End of Period</span>
            <span>{formatCurrency(endingCash)}</span>
          </div>
        </div>
      </div>

      {/* Footer Info Boxes */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-5 text-sm text-gray-700 border border-blue-200">
          <strong>About Cash Flow:</strong> This statement shows how cash moved in and out of your business during the period. Operating activities reflect core business operations, investing activities show capital expenditures, and financing activities track debt, equity, and owner transactions.
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <strong>About Financial Reporting</strong><br />
            M6 Financial Reporting aggregates data from M1 (Invoicing), M2 (Expenses), M4 (Reconciliation), and M5 (Projects) to generate standardized financial statements. All reports use accrual-basis accounting with multi-currency normalization.
          </div>
        </div>
      </div>
    </div>
  );
}