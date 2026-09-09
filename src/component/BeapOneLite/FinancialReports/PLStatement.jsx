import { useState } from 'react';
import { Info, Download, TrendingUp, DollarSign } from 'lucide-react';

export default function PLStatement({ reportData, explanations }) {
  const [showExplanations, setShowExplanations] = useState(false);

  // Fallback for missing data
  if (!reportData || !explanations) {
    return <div className="p-6 text-center text-red-500">No report data available for the selected period and location.</div>;
  }

  // --- Calculations ---
  const grossProfit = reportData.totalRevenue - reportData.cogs;
  const netProfitBeforeTax = grossProfit - reportData.operatingExpenses;

  // --- Utility Functions ---

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateMargin = (profit, revenue) => {
    if (revenue === 0) return '0.0%';
    return ((profit / revenue) * 100).toFixed(1) + '%';
  };

  // Standard React/Browser export function using Print-to-PDF
  const handleDownloadPDF = () => {
    // This will trigger the browser's print dialog, which usually includes
    // an option to "Save as PDF" or "Microsoft Print to PDF".
    window.print();
  };

  // --- Render ---

  return (
    <div className="space-y-6 mt-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <DollarSign size={26}/> Profit & Loss Statement
          </h2>
          <p className="text-gray-600 text-sm mt-1">{reportData.period}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="flex items-center gap-2 px-4 py-2 bg-white/93 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium transition border "
          >
            <Info className="w-4 h-4" />
            {showExplanations ? 'Hide Explanations' : 'Show Explanations'}
          </button>

          <button
            onClick={handleDownloadPDF}
            // Use Tailwind class to hide button in print view if necessary (optional)
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg text-sm font-medium transition border bg-white/93 print:hidden"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gross Profit Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Gross Profit</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(grossProfit)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Margin: {calculateMargin(grossProfit, reportData.totalRevenue)}</p>
        </div>

        {/* Net Profit Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Net Profit</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(netProfitBeforeTax)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Margin: {calculateMargin(netProfitBeforeTax, reportData.totalRevenue)}</p>
        </div>

        {/* Performance Card */}
        <div className={`p-5 rounded-xl border ${netProfitBeforeTax > 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm">Performance</p>
              <p className={`text-lg font-bold mt-1 ${netProfitBeforeTax > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {netProfitBeforeTax > 0 ? 'Profitable' : 'Loss'}
              </p>
            </div>
            <TrendingUp className={`w-8 h-8 ${netProfitBeforeTax > 0 ? 'text-green-600' : 'text-red-600 rotate-180'}`} />
          </div>
        </div>
      </div>

      {/* Detailed Statement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Detailed Statement</h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Total Revenue */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                Total Revenue
                <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
              </h4>
              <span className="font-bold text-lg">{formatCurrency(reportData.totalRevenue)}</span>
            </div>
            {showExplanations && (
              <div className="mt-2 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
                {explanations.totalRevenue}
              </div>
            )}
            <div className="h-px bg-gray-300 mt-4"></div>
          </div>

          {/* COGS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-700 flex items-center gap-2">
                Cost of Goods Sold (COGS)
                <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
              </h4>
              <span className="text-red-600">({formatCurrency(reportData.cogs)})</span>
            </div>
            {showExplanations && (
              <div className="mt-2 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
                {explanations.cogs}
              </div>
            )}
          </div>

          {/* Gross Profit */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                Gross Profit
                <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
              </h4>
              <span className="text-2xl font-bold text-green-700">
                {formatCurrency(grossProfit)}
              </span>
            </div>
            {showExplanations && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
                {explanations.grossProfit}
              </div>
            )}
          </div>

          {/* Operating Expenses */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Operating Expenses</h4>
            <div className="space-y-3 pl-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Other Expenses</span>
                <span className="text-red-600">({formatCurrency(reportData.operatingExpenses)})</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-300">
                <span>Total Operating Expenses</span>
                <span className="text-red-600">({formatCurrency(reportData.operatingExpenses)})</span>
              </div>
            </div>
            {showExplanations && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
                {explanations.operatingExpenses}
              </div>
            )}
          </div>

          {/* Net Profit */}
          <div className="bg-blue-900 text-white p-6 rounded-xl -mx-6 mt-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Net Profit (Before Tax)</h3>
              <span className="text-2xl font-bold">
                {formatCurrency(netProfitBeforeTax)}
              </span>
            </div>
              {showExplanations && (
              <div className="mt-3 p-4 bg-blue-800 rounded-lg text-sm text-white border border-blue-700">
                {explanations.netProfitBeforeTax}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Footer */}
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