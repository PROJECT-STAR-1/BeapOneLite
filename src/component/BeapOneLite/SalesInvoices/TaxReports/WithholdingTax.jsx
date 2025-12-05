import React from 'react';
import {
  AlertTriangle,
  CreditCard,
  FileText,
  TrendingUp,
  Download,
  ClipboardList,
} from 'lucide-react';

// --- MOCK DATA ---
const mockData = {
  // Data for the top summary cards
  summaryCards: [
    {
      title: 'Total WHT Credit',
      value: '₦116,279.07',
      subtitle: 'Withheld by clients',
      icon: CreditCard,
      iconBg: 'bg-orange-100/70 text-orange-600',
      percentageIcon: 'bg-orange-200 text-orange-700',
      percentage: '%', // Placeholder for the circular percentage icon in the image
    },
    {
      title: 'WHT Invoices',
      value: '0',
      subtitle: 'With WHT applied',
      icon: FileText,
      iconBg: 'bg-blue-100/70 text-blue-600',
      percentageIcon: 'bg-blue-200 text-blue-700',
    },
    {
      title: 'WHT Utilization',
      value: '30%',
      subtitle: 'Of total invoices',
      icon: TrendingUp,
      iconBg: 'bg-purple-100/70 text-purple-600',
      percentageIcon: 'bg-purple-200 text-purple-700',
    },
  ],
  // Data for the WHT Summary Details card
  summaryDetails: [
    { label: 'Standard WHT Rate', value: '5%' },
    { label: 'Total Invoices Subject to WHT', value: '0' },
    { label: 'Total WHT Amount', value: '₦116,279.07', isCurrency: true, color: 'text-red-500' },
    { label: 'Tax Credit Available', value: '₦116,279.07', isCurrency: true, color: 'text-emerald-500' },
  ],
  // Data for the WHT by Customer card
  customerWHT: [
    { id: 1, name: 'Acme Corporation', invoices: 1, amount: 359883.72 },
    { id: 2, name: 'Beta Systems Inc.', invoices: 3, amount: 98765.43 },
    { id: 3, name: 'Gamma Corp', invoices: 1, amount: 50000.00 },
    // Use an empty array to test the No WHT UI:
    // If you want to test the empty state, change the array above to:
    // customerWHT: [],
  ],
};

// --- WHT CARD COMPONENT (Top Summary) ---
const WHTCard = ({ title, value, subtitle, icon: Icon, iconBg, percentageIcon, percentage }) => (
  <div className="flex-1  p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
    <div className="text-sm font-semibold text-gray-600">{title}</div>
    <div className="flex items-center justify-between mt-1">
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {/* Icon/Percentage Circle */}
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${percentageIcon}`}>
        {percentage ? (
          <span className="text-xl font-bold">{percentage}</span> // For the custom percentage graphic
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
  </div>
);

// --- WHT INFO ALERT ---
const WHTInfoAlert = () => (
  <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg flex items-start space-x-3 mt-6">
    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
    <div>
      <h3 className="text-sm font-semibold text-orange-800">Withholding Tax (WHT) Information</h3>
      <p className="mt-1 text-sm text-orange-700">
        WHT is deducted by clients and remitted directly to the tax authority on your behalf. This amount counts toward your final invoice settlement and can be claimed as a credit during annual tax reconciliation.
      </p>
    </div>
  </div>
);

// --- WHT SUMMARY DETAILS COMPONENT ---
const WHTSummaryDetails = ({ data }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
    <h2 className="text-lg font-bold text-gray-800">WHT Summary Details</h2>
    <p className="text-sm text-gray-500 mb-6">Comprehensive breakdown for tax filing</p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      {data.map(({ label, value, color }) => (
        <div key={label} className="flex flex-col">
          <span className="text-sm text-gray-600">{label}</span>
          <span className={`text-xl font-semibold mt-0.5 ${color || 'text-gray-900'}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- CUSTOMER LIST ITEM COMPONENT ---
const CustomerListItem = ({ customer, index }) => {
  const isTop = index < 3;
  const isLast = index === mockData.customerWHT.length - 1;

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <div className="flex items-center space-x-3">
        {/* Rank Badge */}
        <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${
          isTop
            ? 'bg-yellow-100 text-yellow-600'
            : 'bg-gray-100 text-gray-500'
        }`}>
          #{index + 1}
        </span>
        <div>
          <p className="text-sm font-medium text-gray-800">{customer.name}</p>
          <p className="text-xs text-gray-500">{customer.invoices} invoice(s)</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          {formatCurrency(customer.amount)}
        </p>
        <p className="text-xs text-orange-500 font-medium">WHT withheld</p>
      </div>
    </div>
  );
};

// --- EMPTY CUSTOMER LIST UI ---
const NoWHTByCustomer = () => (
  <div className="flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 mt-4">
    <ClipboardList className="w-12 h-12 text-gray-400 mb-3" />
    <h3 className="text-lg font-semibold text-gray-800">No WHT Deductions Found</h3>
    <p className="mt-1 text-sm text-gray-500 max-w-sm">
      It looks like no customers have withheld tax on your behalf yet. WHT deductions will appear here once they are recorded.
    </p>
  </div>
);

// --- WHT BY CUSTOMER COMPONENT ---
const WHTCustomerList = ({ customers }) => {
  const hasData = customers && customers.length > 0;

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">WHT by Customer</h2>
          <p className="text-sm text-gray-500">
            {hasData ? `Top ${customers.length} clients with WHT deductions` : 'Client breakdown for WHT'}
          </p>
        </div>
        {hasData && (
          <button className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-150 shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {hasData ? (
          customers.map((customer, index) => (
            <CustomerListItem key={customer.id} customer={customer} index={index} />
          ))
        ) : (
          <NoWHTByCustomer />
        )}
      </div>
    </div>
  );
};


// --- MAIN DASHBOARD COMPONENT ---
const WithholdingTaxDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Withholding Tax Overview</h1>
        <p className="text-gray-500">Manage and track your WHT credits and deductions.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        {mockData.summaryCards.map((card, index) => (
          <WHTCard key={index} {...card} />
        ))}
      </div>

      {/* 2. WHT Info Alert */}
      <WHTInfoAlert />

      <div className="grid grid-cols-1 gap-6 mt-6">
        <WHTCustomerList customers={mockData.customerWHT} />

        <WHTSummaryDetails data={mockData.summaryDetails} />
      </div>

      
    </div>
  );
};

export default WithholdingTaxDashboard;