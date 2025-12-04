// components/BalanceSheet.jsx

import { useState } from 'react';
import { Download, AlertTriangle, Info } from 'lucide-react';


export default function BalanceSheet() {
  const asOfDate = 'December 4, 2025';

  // Balance Sheet Data
  const data = {
    assets: {
      current: [
        { label: 'Cash and Bank', amount: 0 },
        { label: 'Accounts Receivable', amount: 0 },
        { label: 'Inventory', amount: 150000 },
        { label: 'Prepaid Expenses', amount: 45000 },
      ],
      fixed: [
        { label: 'Property, Plant & Equipment', amount: 850000 },
        { label: 'Less: Accumulated Depreciation', amount: -120000, negative: true },
      ],
    },
    liabilities: {
      current: [
        { label: 'Accounts Payable', amount: 0 },
        { label: 'Accrued Expenses', amount: 35000 },
        { label: 'Short-term Debt', amount: 100000 },
        { label: 'Taxes Payable', amount: 25000 },
      ],
      longTerm: [
        { label: 'Long-term Debt', amount: 300000 },
        { label: 'Deferred Revenue', amount: 50000 },
      ],
    },
    equity: [
      { label: "Owner's Equity", amount: 500000 },
      { label: 'Retained Earnings', amount: 75000 },
      { label: 'Current Period Income', amount: 0 },
    ],
  };

  // Calculations
  const totalCurrentAssets = data.assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalFixedAssets = data.assets.fixed.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalFixedAssets;

  const totalCurrentLiabilities = data.liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalLongTermLiabilities = data.liabilities.longTerm.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalLongTermLiabilities;

  const totalEquity = data.equity.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  const difference = totalAssets - totalLiabilitiesAndEquity; // -160,000
  const isBalanced = difference === 0;

  const formatCurrency = (amount) => {
    const abs = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(abs);
    return amount < 0 ? `-${formatted}` : formatted;
  };

const handleExportPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title
  doc.setFontSize(20);
  doc.setTextColor(30, 58, 138);
  doc.text('Balance Sheet', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`As of ${asOfDate}`, pageWidth / 2, 30, { align: 'center' });

  let y = 50;

  // Helper to add line items
  const addLineItem = (label, amount, indent = 0) => {
    const xLabel = 20 + indent * 10;
    const xAmount = 180;

    if (amount < 0) doc.setTextColor(220, 38, 38); // red
    else doc.setTextColor(0, 0, 0);

    doc.text(label, xLabel, y);
    doc.text(formatCurrency(amount), xAmount, y, { align: 'right' });
    y += 7;
  };

  const addSectionHeader = (text, color = [59, 130, 246]) => {
    doc.setFillColor(...color);
    doc.setDrawColor(...color);
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.rect(14, y - 8, pageWidth - 28, 10, 'F');
    doc.text(text, pageWidth / 2, y - 2, { align: 'center' });
    y += 10;
    doc.setTextColor(0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
  };

  // === ASSETS ===
  addSectionHeader('ASSETS', [191, 219, 254]);

  doc.setFont(undefined, 'bold');
  doc.text('Current Assets', 20, y);
  y += 10;

  data.assets.current.forEach(item => addLineItem(item.label, item.amount, 1));
  y += 5;
  doc.setDrawColor(59, 130, 246);
  doc.line(20, y - 3, 190, y - 3);
  addLineItem('Total Current Assets', totalCurrentAssets);
  y += 10;

  doc.setFont(undefined, 'bold');
  doc.text('Fixed Assets', 20, y);
  y += 10;

  data.assets.fixed.forEach(item => addLineItem(item.label, item.amount, 1));
  y += 5;
  doc.line(20, y - 3, 190, y - 3);
  addLineItem('Total Fixed Assets', totalFixedAssets);
  y += 10;

  doc.setFontSize(14);
  doc.setTextColor(30, 58, 138);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL ASSETS', 20, y);
  doc.text(formatCurrency(totalAssets), 180, y, { align: 'right' });
  y += 20;

  // === LIABILITIES ===
  addSectionHeader('LIABILITIES', [254, 226, 226]);

  doc.text('Current Liabilities', 20, y);
  y += 10;
  data.liabilities.current.forEach(item => addLineItem(item.label, item.amount, 1));
  y += 5;
  doc.setDrawColor(220, 38, 38);
  doc.line(20, y - 3, 190, y - 3);
  addLineItem('Total Current Liabilities', totalCurrentLiabilities);
  y += 10;

  doc.text('Long-term Liabilities', 20, y);
  y += 10;
  data.liabilities.longTerm.forEach(item => addLineItem(item.label, item.amount, 1));
  y += 5;
  doc.line(20, y - 3, 190, y - 3);
  addLineItem('Total Long-term Liabilities', totalLongTermLiabilities);
  y += 10;

  doc.setTextColor(220, 38, 38);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL LIABILITIES', 20, y);
  doc.text(formatCurrency(totalLiabilities), 180, y, { align: 'right' });
  y += 15;

  // === EQUITY ===
  addSectionHeader('EQUITY', [220, 252, 231]);

  data.equity.forEach(item => addLineItem(item.label, item.amount, 1));
  y += 5;
  doc.setDrawColor(34, 197, 94);
  doc.line(20, y - 3, 190, y - 3);
  addLineItem('TOTAL EQUITY', totalEquity);
  y += 15;

  // Final Total
  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL LIABILITIES & EQUITY', 20, y);
  doc.text(formatCurrency(totalLiabilitiesAndEquity), 180, y, { align: 'right' });

  // Imbalance Warning
  if (!isBalanced) {
    y += 20;
    doc.setFillColor(254, 226, 226);
    doc.setTextColor(220, 38, 38);
    doc.roundedRect(14, y - 10, pageWidth - 28, 20, 3, 3, 'F');
    doc.setFontSize(12);
    doc.text(`Warning: Balance sheet does not balance. Difference: ${formatCurrency(difference)}`, pageWidth / 2, y + 5, { align: 'center' });
  }

  doc.save(`Balance_Sheet_${asOfDate.replace(/[^a-z0-9]/gi, '_')}.pdf`);
};

  return (
    <div className="space-y-6 mt-5 p-3 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Balance Sheet</h2>
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
            className="flex items-center gap-2 px-4 py-2 bg-white/93 hover:bg-gray-100  rounded-lg text-sm font-medium transition"
          >
            <Download className="w-4 h-4" />
            Export PDF
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
              {data.assets.current.map((item, i) => (
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
              {data.assets.fixed.map((item, i) => (
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
                {data.liabilities.current.map((item, i) => (
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
                {data.liabilities.longTerm.map((item, i) => (
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
              {data.equity.map((item, i) => (
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