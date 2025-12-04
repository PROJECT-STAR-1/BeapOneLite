
import { useState } from 'react';
import { Info, Download, TrendingUp, DollarSign } from 'lucide-react';

export default function PLStatement() {
  const [showExplanations, setShowExplanations] = useState(false);

  const reportData = {
    period: 'November 4, 2025 – December 4, 2025',
    grossProfit: 13618000,
    netProfit: 13246938,
    totalRevenue: 13618000,
    cogs: 0,
    operatingExpenses: 371063,
    netProfitBeforeTax: 13246938,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text('Profit & Loss Statement', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(reportData.period, 105, 30, { align: 'center' });

    // Summary Cards
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Gross Profit', 20, 50);
    doc.text(formatCurrency(reportData.grossProfit), 180, 50, { align: 'right' });

    doc.text('Net Profit (Before Tax)', 20, 60);
    doc.setTextColor(30, 58, 138);
    doc.setFont(undefined, 'bold');
    doc.text(formatCurrency(reportData.netProfitBeforeTax), 180, 60, { align: 'right' });

    // Table
    doc.autoTable({
      startY: 80,
      head: [['Item', 'Amount (₦)']],
      body: [
        ['Total Revenue', formatCurrency(reportData.totalRevenue)],
        ['Cost of Goods Sold (COGS)', formatCurrency(reportData.cogs)],
        [{ content: 'Gross Profit', styles: { fontStyle: 'bold' } }, formatCurrency(reportData.grossProfit)],
        ['Operating Expenses', ''],
        ['   Other Expenses', formatCurrency(-reportData.operatingExpenses)],
        ['Total Operating Expenses', formatCurrency(-reportData.operatingExpenses)],
        [{ content: 'Net Profit (Before Tax)', styles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold' } }, formatCurrency(reportData.netProfitBeforeTax)],
      ],
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 4 },
      headStyles: { fillColor: [243, 244, 246], textColor: [55, 65, 81] },
    });

    doc.save('Profit_and_Loss_Statement.pdf');
  };

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
            className="flex items-center gap-2 px-4 py-2  hover:bg-gray-50 rounded-lg text-sm font-medium transition border bg-white/93 "
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Gross Profit</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(reportData.grossProfit)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Margin: 100.0%</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm">Net Profit</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatCurrency(reportData.netProfit)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Margin: 97.3%</p>
        </div>

        <div className="bg-green-50 p-5 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm">Performance</p>
              <p className="text-lg font-bold text-green-700 mt-1">Profitable</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
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
                This is the total money customers paid you for your goods and services during this period.
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
                The direct cost of the products you sold (e.g., inventory purchases, raw materials).
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
                {formatCurrency(reportData.grossProfit)}
              </span>
            </div>
            {showExplanations && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-100">
                What you earned before paying your business overhead costs.
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
                All the day-to-day costs to keep your doors open, like rent and wages.
              </div>
            )}
          </div>

          {/* Net Profit */}
          <div className="bg-blue-900 text-white p-6 rounded-xl -mx-6 mt-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Net Profit (Before Tax)</h3>
              <span className="text-2xl font-bold">
                {formatCurrency(reportData.netProfitBeforeTax)}
              </span>
            </div>
             {showExplanations && (
              <div className="mt-3 p-4 bg-blue-800 rounded-lg text-sm text-white border border-blue-700">
                The final money your business made (or lost) this period.
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