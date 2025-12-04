// components/TaxPreviewReport.jsx

import { useState } from 'react';
import { Download, Calendar, FileText, Info, X } from 'lucide-react';

export default function TaxPreviewReport() {
  const [showEfilingModal, setShowEfilingModal] = useState(false);

  // =============================================
  // ALL MOCK DATA — Replace this object when backend comes
  // =============================================
  const taxData = {
    period: '11/4/2025 – 12/4/2025',
    filingDueDate: 'December 25, 2025',
    isOnTrack: true,

    vat: {
      outputVat: 0,
      inputVat: 0,
      netPayable: 0,
    },

    wht: {
      items: [
        { category: 'Consultancy (5%)', rate: '5.0%', amount: 25000 },
        { category: 'Professional Services (10%)', rate: '10.0%', amount: 45000 },
        { category: 'Contract/Commission (5%)', rate: '5.0%', amount: 15000 },
      ],
      totalCredit: 85000,
    },

    incomeTax: {
      grossIncome: 0,
      allowableExpenses: 0,
      taxableIncome: 0,
      whtCreditApplied: 85000,
      estimatedTaxPayable: 0,
    },
  };

  // Helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className='mt-5 p-3'>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            Tax Preview Report
          </h2>
          <p className="text-gray-600">Estimated tax obligations for {taxData.period}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            On Track
          </div>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-medium">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-200">
          <p className="text-blue-700 font-medium">VAT Payable (7.5%)</p>
          <p className="text-3xl font-bold text-blue-900 mt-3">₦0</p>
          <p className="text-sm text-gray-600 mt-2">Output: ₦0</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-200">
          <p className="text-purple-700 font-medium">WHT Deducted</p>
          <p className="text-3xl font-bold text-purple-900 mt-3">₦85,000</p>
          <p className="text-sm text-gray-600 mt-2">Credit Available</p>
        </div>

        <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-200">
          <p className="text-green-700 font-medium">Estimated Income Tax</p>
          <p className="text-3xl font-bold text-green-900 mt-3">₦0</p>
          <p className="text-sm text-gray-600 mt-2">Progressive Rate</p>
        </div>
      </div>

      {/* VAT Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-blue-100 px-6 py-4">
          <h3 className="text-lg font-bold text-blue-900">Value Added Tax (VAT)</h3>
          <p className="text-sm text-blue-700">7.5% standard rate in Nigeria</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-between text-gray-700">
            <span>Output VAT (Sales)</span>
            <span>₦0</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Less: Input VAT (Purchases)</span>
            <span>-₦0</span>
          </div>
          <div className="border-t-2 border-blue-500 pt-5">
            <div className="flex justify-between text-lg font-bold text-blue-900">
              <span>Net VAT Payable</span>
              <span>₦0</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 border border-blue-200">
            Note: VAT returns are typically due within 21 days after the end of the month. Ensure timely filing to avoid penalties.
          </div>
        </div>
      </div>

      {/* WHT Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-purple-100 px-6 py-4">
          <h3 className="text-lg font-bold text-purple-900">Withholding Tax (WHT)</h3>
          <p className="text-sm text-purple-700">Tax credits from WHT deductions</p>
        </div>
        <div className="p-6 space-y-5">
          {taxData.wht.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-800">{item.category}</p>
                <p className="text-xs text-gray-500">Rate: {item.rate}</p>
              </div>
              <span className="font-semibold text-purple-800">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          <div className="border-t-2 border-purple-500 pt-5">
            <div className="flex justify-between text-lg font-bold text-purple-900">
              <span>Total WHT Available for Credit</span>
              <span>{formatCurrency(taxData.wht.totalCredit)}</span>
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-800 border border-purple-200">
            Note: WHT deductions can be used as tax credits against your income tax liability. Keep all WHT certificates from clients.
          </div>
        </div>
      </div>

      {/* Income Tax Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="bg-green-100 px-6 py-4">
          <h3 className="text-lg font-bold text-green-900">Income Tax Computation</h3>
          <p className="text-sm text-green-700">Estimated tax based on taxable income</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-between text-gray-700">
            <span>Gross Income</span>
            <span>₦0</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Less: Allowable Expenses</span>
            <span>-₦0</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900">
            <span>Taxable Income</span>
            <span>₦0</span>
          </div>
          <div className="flex justify-between text-red-700">
            <span>Less: WHT Credits</span>
            <span>-{formatCurrency(taxData.wht.totalCredit)}</span>
          </div>
          <div className="border-t-2 border-green-600 pt-5">
            <div className="flex justify-between text-xl font-bold text-green-900">
              <span>Estimated Tax Payable</span>
              <span>₦0</span>
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-5 border border-green-200">
            <p className="font-medium text-green-900 mb-3">Progressive Tax Rates (Nigeria):</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>First ₦300,000: <span className="font-bold">7%</span></div>
              <div>Next ₦300,000: <span className="font-bold">11%</span></div>
              <div>Next ₦500,000: <span className="font-bold">15%</span></div>
              <div>Above ₦1,100,000: <span className="font-bold">19%</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filing Deadline Card */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-start gap-4">
            <Calendar className="w-10 h-10 text-yellow-700 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-bold text-yellow-900">Filing Deadline</h4>
              <p className="text-yellow-800 font-medium">Due Date: {taxData.filingDueDate}</p>
              <p className="text-sm text-green-700 font-medium mt-1">You are on track for timely tax compliance.</p>
            </div>
          </div>
          <button
            onClick={() => setShowEfilingModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 rounded-lg font-medium transition border border-yellow-400"
          >
            <FileText className="w-5 h-5" />
            File Return
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 border border-gray-200 mb-6">
        <strong>Disclaimer:</strong> This report provides estimates for planning purposes only and should not be considered as professional tax advice. Tax rates and regulations vary by jurisdiction and entity type. Consult with a qualified tax professional or use the M12 E-Invoicing & Tax Compliance module for accurate tax filing. BEAPOne Lite is not liable for any tax penalties or miscalculations.
      </div>

      {/* About Financial Reporting */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700">
          <strong>About Financial Reporting</strong><br />
          M6 Financial Reporting aggregates data from M1 (Invoicing), M2 (Expenses), M4 (Reconciliation), and M5 (Projects) to generate standardized financial statements. All reports use accrual-basis accounting with multi-currency normalization.
        </div>
      </div>

      {/* E-Filing Modal */}
      {showEfilingModal && (
        <div className="fixed inset-0 bg-black/5 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowEfilingModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Info className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-Filing Integration</h3>
              <p className="text-gray-700 mb-8">
                Tax filing integration with FIRS, KRA, and URA is available in the<br />
                <span className="font-bold text-blue-900">M12 E-Invoicing & Tax Compliance module</span>.
              </p>
              <button
                onClick={() => setShowEfilingModal(false)}
                className="w-full py-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-bold text-lg transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}