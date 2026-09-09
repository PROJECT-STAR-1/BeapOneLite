// components/BalanceSheet.jsx

import { useState, useEffect } from 'react';
import { Download, AlertTriangle, Info, DollarSign } from 'lucide-react';


export default function BalanceSheet() {
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    async function fetchBalanceSheetData() {
      try {
        const res = await fetch('/api/beapOnelite/financialreports');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        
        // Extract the balance sheet specific data from the main payload
        if (json.balanceSheetData) {
          setBalanceSheetData(json.balanceSheetData);
        } else {
          setError("Balance Sheet data not found in the API response.");
        }
      } catch (err) {
        console.error("Failed to fetch Balance Sheet data:", err);
        setError("Failed to load financial data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalanceSheetData();
  }, []);
  // -----------------------------

  if (isLoading) {
      return <div className="p-6 text-center text-gray-500">Loading Balance Sheet...</div>;
  }
  
  if (error || !balanceSheetData) {
      return <div className="p-6 text-center text-red-500">{error || "Balance Sheet data is not available."}</div>;
  }

  // Destructure data once available
  const { asOfDate, assets, liabilities, equity } = balanceSheetData;

  // Calculations (UNCHANGED)
  const totalCurrentAssets = assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedAssets = assets.fixed.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalLongTermLiabilities = liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const difference = totalAssets - totalLiabilitiesAndEquity;
  const isBalanced = Math.abs(difference) < 0.01; 

  const formatCurrency = (amount) => {
    const abs = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(abs);
    return amount < 0 ? `-${formatted}` : formatted;
  };

  // Export Function (UNCHANGED - uses window.print())
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 mt-5 p-3 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <DollarSign size={26}/> Balance Sheet
          </h2>
          <p className="text-gray-600 text-sm mt-1">As of {asOfDate}</p>
        </div>

        <div className="flex items-center gap-3">
          {!isBalanced && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Imbalanced
            </div>
          )}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/93 hover:bg-gray-100 rounded-lg text-sm font-medium transition print:hidden border"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ASSETS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-100 px-6 py-4">
            <h3 className="text-lg font-bold text-blue-900">ASSETS</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Current Assets</p>
              {assets.current.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t-2 border-blue-400 pt-3 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Current Assets</span>
                  <span>{formatCurrency(totalCurrentAssets)}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">Fixed Assets</p>
              {assets.fixed.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span className="text-gray-700">{item.label}</span>
                  <span className={item.negative ? 'text-red-600' : 'font-medium'}>
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
              <div className="border-t-2 border-blue-400 pt-3 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Fixed Assets</span>
                  <span>{formatCurrency(totalFixedAssets)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-4 border-blue-500 pt-4 -mx-6 px-6 bg-blue-50">
              <div className="flex justify-between text-xl font-bold text-blue-900">
                <span>TOTAL ASSETS</span>
                <span>{formatCurrency(totalAssets)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* LIABILITIES & EQUITY */}
        <div className="space-y-6">
          {/* Liabilities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-red-100 px-6 py-4">
              <h3 className="text-lg font-bold text-red-900">LIABILITIES</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">Current Liabilities</p>
                {liabilities.current.map((item, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-red-300 pt-3 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Current Liabilities</span>
                    <span>{formatCurrency(totalCurrentLiabilities)}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600 mb-3">Long-term Liabilities</p>
                {liabilities.longTerm.map((item, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t border-red-300 pt-3 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total Long-term Liabilities</span>
                    <span>{formatCurrency(totalLongTermLiabilities)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-red-400 pt-4 -mx-6 px-6 bg-red-50">
                <div className="flex justify-between text-lg font-bold text-red-900">
                  <span>TOTAL LIABILITIES</span>
                  <span>{formatCurrency(totalLiabilities)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-100 px-6 py-4">
              <h3 className="text-lg font-bold text-green-900">EQUITY</h3>
            </div>
            <div className="p-6">
              {equity.map((item, i) => (
                <div key={i} className="flex justify-between py-2">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="border-t-2 border-green-400 pt-4 mt-6">
                <div className="flex justify-between text-lg font-bold text-green-900">
                  <span>TOTAL EQUITY</span>
                  <span>{formatCurrency(totalEquity)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Liabilities & Equity */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 text-center">
            <p className="text-lg font-bold text-blue-900">TOTAL LIABILITIES & EQUITY</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {formatCurrency(totalLiabilitiesAndEquity)}
            </p>
          </div>
        </div>
      </div>

      {/* Imbalance Warning - Perfect Match to Your Screenshot */}
      {!isBalanced && (
        <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            {/* Calculation Row */}
            <div className="flex items-center justify-center gap-6 text-lg font-medium">
              <div className="text-right">
                <p className="text-gray-700">Assets</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalAssets)}</p>
              </div>

              <span className="text-gray-500 text-2xl">−</span>

              <div className="text-left">
                <p className="text-gray-700">Liabilities + Equity</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalLiabilitiesAndEquity)}</p>
              </div>

              <span className="text-gray-500 text-2xl">=</span>

              <div className="text-left min-w-40">
                <p className="text-gray-700">Difference</p>
                <p className={`text-2xl font-bold ${difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(difference)}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-center justify-center gap-2 text-red-700 font-medium pt-4 border-t border-red-200">
              <AlertTriangle className="w-6 h-6" />
              <span>Warning: Balance sheet does not balance. Please review entries.</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <strong>About Financial Reporting</strong><br />
          M6 Financial Reporting aggregates data from M1 (Invoicing), M2 (Expenses), M4 (Reconciliation), and M5 (Projects) to generate standardized financial statements. All reports use accrual-basis accounting with multi-currency normalization.
        </div>
      </div>
    </div>
  );
}