
import { Download, ArrowDownUp, Info } from 'lucide-react';

export default function CashFlowStatement() {
  // =============================================
  // ALL MOCK DATA IS HERE 
  // =============================================
  const cashFlowData = {
    period: '11/4/2025 – 12/4/2025',
    beginningCash: 250000,
    netChange: 78000,                    
    endingCash: 328000,                 

    operating: {
      netIncome: 0,
      adjustments: [
        { label: 'Depreciation & Amortization', amount: 15000 },
        { label: 'Increase in Accounts Receivable', amount: -25000 },
        { label: 'Decrease in Inventory', amount: 10000 },
        { label: 'Increase in Accounts Payable', amount: 18000 },
      ],
      netCash: 18000,
    },

    investing: {
      items: [
        { label: 'Purchase of Property, Plant & Equipment', amount: -50000 },
        { label: 'Proceeds from Sale of Assets', amount: 0 },
      ],
      netCash: -50000,
    },

    financing: {
      items: [
        { label: 'Proceeds from Loans', amount: 100000 },
        { label: 'Loan Repayments', amount: -25000 },
        { label: 'Owner Contributions', amount: 50000 },
        { label: 'Owner Draws', amount: -15000 },
      ],
      netCash: 110000,
    },
  };



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

  return (
    <div className='mt-5 p-3'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <ArrowDownUp className="w-7 h-7" />
            Cash Flow Statement
          </h2>
          <p className="text-gray-600">For the period {cashFlowData.period}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
            cashFlowData.netChange >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            Net Change: {formatCurrency(cashFlowData.netChange)}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium rounded-lg">
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
            {formatCurrency(cashFlowData.operating.netIncome)}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-4">Adjustments to reconcile net income to net cash:</p>
            <div className="space-y-3 ml-6">
              {cashFlowData.operating.adjustments.map((item, i) => (
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
              <span className={cashFlowData.operating.netCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(cashFlowData.operating.netCash)}
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
          {cashFlowData.investing.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-700">{item.label}</span>
              {formatCurrency(item.amount)}
            </div>
          ))}
          <div className="border-t-2 border-purple-500 pt-4">
            <div className="flex justify-between text-lg font-bold text-purple-900">
              <span>Net Cash from Investing Activities</span>
              <span className={cashFlowData.investing.netCash >= 0 ? 'text-green-600' : 'text-red-600'}>
                {formatCurrency(cashFlowData.investing.netCash)}
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
          {cashFlowData.financing.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-gray-700">{item.label}</span>
              {formatCurrency(item.amount)}
            </div>
          ))}
          <div className="border-t-2 border-green-500 pt-4">
            <div className="flex justify-between text-lg font-bold text-green-900">
              <span>Net Cash from Financing Activities</span>
              <span className="text-green-600">{formatCurrency(cashFlowData.financing.netCash)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards + Final Totals */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border-2 border-blue-300 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <p className="text-sm text-gray-600">Operating Cash Flow</p>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(18000)}</p>
            <p className="text-xs text-gray-500">23% of total</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Investing Cash Flow</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(-50000)}</p>
            <p className="text-xs text-gray-500">-64% of total</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Financing Cash Flow</p>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(110000)}</p>
            <p className="text-xs text-gray-500">141% of total</p>
          </div>
        </div>

        <div className="border-t-4 border-blue-600 pt-8">
          <div className="flex justify-between text-xl font-bold text-blue-900 mb-4">
            <span>Net Change in Cash</span>
            <span className="text-green-600">+{formatCurrency(cashFlowData.netChange)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Cash at Beginning of Period</span>
            <span>{formatCurrency(cashFlowData.beginningCash)}</span>
          </div>
          <div className="flex justify-between text-3xl font-bold text-blue-900 mt-6 pt-6 border-t-4 border-blue-700">
            <span>Cash at End of Period</span>
            <span>{formatCurrency(cashFlowData.endingCash)}</span>
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